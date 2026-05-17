import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, AlertCircle, Loader2, Award, ArrowLeft, HelpCircle } from 'lucide-react';

const ShortlistedDashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jobRequirements, setJobRequirements] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const matched = localStorage.getItem('matchedCandidates');
    const requirements = localStorage.getItem('jobRequirements');

    if (!matched || !requirements) {
      navigate('/job-requirements');
      return;
    }

    const parsedCandidates = JSON.parse(matched);
    const parsedReqs = JSON.parse(requirements);
    
    setCandidates(parsedCandidates);
    setJobRequirements(parsedReqs);

    if (parsedCandidates.length > 0) {
      runAiAnalysis(parsedCandidates, parsedReqs);
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const runAiAnalysis = async (cands, reqs) => {
    try {
      const response = await api.post('/ai/shortlist', {
        candidates: cands,
        jobRequirements: reqs
      });
      setAiAnalysis(response.data.aiRankings);
    } catch (err) {
      setError('AI analysis failed or timed out. Showing base match results.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // emerald-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  // Prepare chart data based on base match logic or AI if available
  const chartData = aiAnalysis 
    ? aiAnalysis.map(a => ({ name: a.name.split(' ')[0], score: Number(a.aiScore) }))
    : candidates.map(c => ({ name: c.name.split(' ')[0], score: c.matchMetrics.reqMatchPercentage }));

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/30 animate-pulse"></div>
          <Sparkles className="animate-bounce text-indigo-400 relative z-10" size={48} />
        </div>
        <p className="text-slate-300 font-medium animate-pulse">OpenRouter AI is analyzing candidates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/job-requirements')} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="text-indigo-400" />
            AI Shortlist Results
          </h1>
          <p className="text-slate-400 mt-1">Intelligent evaluation and ranking</p>
        </div>
      </div>

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/50 text-amber-400 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p>{error}</p>
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
          <p className="text-slate-400 mb-4">No candidates found in the database to match against.</p>
          <button onClick={() => navigate('/add-candidate')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
            Add Candidates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Candidates List */}
          <div className="lg:col-span-2 space-y-6">
            {aiAnalysis ? (
              // Display AI Rankings
              aiAnalysis.sort((a,b) => b.aiScore - a.aiScore).map((aiResult, index) => {
                const candidateInfo = candidates.find(c => c._id === aiResult.candidateId || c.name === aiResult.name);
                return (
                  <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500/20 to-transparent w-full h-full pointer-events-none"></div>
                    )}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          {aiResult.name}
                          {index === 0 && <Award className="text-emerald-400" size={20} />}
                        </h2>
                        {candidateInfo && (
                          <p className="text-sm text-slate-400 mt-1">{candidateInfo.experience} years exp • {candidateInfo.skills.join(', ')}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold" style={{ color: getScoreColor(aiResult.aiScore) }}>
                          {aiResult.aiScore}%
                        </span>
                        <span className="text-xs text-slate-500 uppercase font-semibold">AI Match Score</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 mb-4 relative z-10">
                      <h3 className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-2">
                        <Sparkles size={16} /> AI Explanation
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{aiResult.explanation}</p>
                    </div>

                    {aiResult.interviewQuestions && aiResult.interviewQuestions.length > 0 && (
                      <div className="relative z-10 mt-4">
                        <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                          <HelpCircle size={16} /> Suggested Interview Questions
                        </h3>
                        <ul className="space-y-2">
                          {aiResult.interviewQuestions.map((q, i) => (
                            <li key={i} className="text-sm text-slate-300 bg-slate-800 border border-slate-700 p-3 rounded-md flex gap-3">
                              <span className="text-amber-500 font-bold">{i+1}.</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Fallback to base match if AI fails/loading
              candidates.map((candidate, index) => (
                <div key={candidate._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
                      <p className="text-sm text-slate-400">{candidate.experience} years • {candidate.matchMetrics.ranking} Match</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-emerald-400">
                        {Math.round(candidate.matchMetrics.reqMatchPercentage)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar - Chart & Stats */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Match Scores Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Job Requirements Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {jobRequirements?.requiredSkills?.map(s => (
                      <span key={s} className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Preferred Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {jobRequirements?.preferredSkills?.map(s => (
                      <span key={s} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Min Experience</p>
                  <span className="text-slate-300">{jobRequirements?.minExperience} Years</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ShortlistedDashboard;
