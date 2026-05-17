const axios = require('axios');

exports.aiShortlist = async (req, res) => {
  try {
    const { candidates, jobRequirements } = req.body;

    if (!candidates || !jobRequirements) {
      return res.status(400).json({ error: 'Candidates and job requirements are needed for AI analysis.' });
    }

    // We will use OpenRouter API
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    // Construct the prompt
    const prompt = `
      You are an expert technical recruiter and HR assistant.
      I have a job requirement and a list of candidates. 
      Analyze the candidates against the job requirements and provide:
      1. A final ranking of candidates based on how well they fit the role.
      2. A short explanation of why the top candidates are suitable.
      3. Suggestions for 2-3 tailored interview questions for each top candidate to evaluate their weak spots or verify their skills.

      Job Requirements:
      - Required Skills: ${jobRequirements.requiredSkills.join(', ')}
      - Preferred Skills: ${jobRequirements.preferredSkills.join(', ')}
      - Minimum Experience: ${jobRequirements.minExperience} years

      Candidates Data:
      ${JSON.stringify(candidates.map(c => ({
        id: c._id,
        name: c.name,
        skills: c.skills,
        experience: c.experience,
        projectsBio: c.projectsBio
      })), null, 2)}

      Please return the response strictly in JSON format matching this schema without any markdown wrapping or extra text outside JSON:
      {
        "aiRankings": [
          {
            "candidateId": "string",
            "name": "string",
            "aiScore": "number (0-100)",
            "explanation": "string",
            "interviewQuestions": ["string", "string"]
          }
        ]
      }
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3-8b-instruct', // Using llama-3 for fast/good JSON processing, or can be swapped
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173', // Your site URL
          'X-Title': 'Candidate Shortlisting System'
        }
      }
    );

    let aiResult;
    try {
      const content = response.data.choices[0].message.content;
      // Find JSON block if model still outputs markdown
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      aiResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Error parsing AI response:", response.data.choices[0].message.content);
      return res.status(500).json({ error: 'Failed to parse AI response into JSON format.' });
    }

    res.json(aiResult);
  } catch (error) {
    console.error("OpenRouter API error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'AI analysis failed.' });
  }
};
