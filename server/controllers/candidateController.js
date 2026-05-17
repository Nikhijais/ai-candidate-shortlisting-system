const Candidate = require('../models/Candidate');

// Get all candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new candidate
exports.createCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, projectsBio } = req.body;
    const newCandidate = new Candidate({
      name,
      email,
      skills,
      experience,
      projectsBio
    });
    await newCandidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Basic match logic based on skill overlap and experience
exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, preferredSkills, minExperience } = req.body;
    
    // Fetch all candidates (in a real app, you'd filter by minExperience in the DB query if it's strict)
    const candidates = await Candidate.find();
    
    const reqSkillsLower = (requiredSkills || []).map(s => s.toLowerCase());
    const prefSkillsLower = (preferredSkills || []).map(s => s.toLowerCase());

    const matchedCandidates = candidates.map(candidate => {
      const candidateSkills = candidate.skills.map(s => s.toLowerCase());
      
      // Calculate skill overlap
      let reqMatchCount = 0;
      reqSkillsLower.forEach(skill => {
        if (candidateSkills.includes(skill)) reqMatchCount++;
      });
      
      let prefMatchCount = 0;
      prefSkillsLower.forEach(skill => {
        if (candidateSkills.includes(skill)) prefMatchCount++;
      });

      // Calculate percentage based on required skills
      const reqMatchPercentage = reqSkillsLower.length > 0 ? (reqMatchCount / reqSkillsLower.length) * 100 : 100;
      
      // Experience match
      const isExpMatch = candidate.experience >= (minExperience || 0);

      // Determine ranking (High, Medium, Low)
      let ranking = 'Low';
      if (reqMatchPercentage >= 80 && isExpMatch) {
        ranking = 'High';
      } else if (reqMatchPercentage >= 50) {
        ranking = 'Medium';
      }

      return {
        ...candidate._doc,
        matchMetrics: {
          reqMatchPercentage,
          reqMatchCount,
          prefMatchCount,
          isExpMatch,
          ranking
        }
      };
    });

    // Sort by ranking priority (High -> Medium -> Low) and then by match percentage
    const rankValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
    matchedCandidates.sort((a, b) => {
      if (rankValues[a.matchMetrics.ranking] !== rankValues[b.matchMetrics.ranking]) {
        return rankValues[b.matchMetrics.ranking] - rankValues[a.matchMetrics.ranking];
      }
      return b.matchMetrics.reqMatchPercentage - a.matchMetrics.reqMatchPercentage;
    });

    res.json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
