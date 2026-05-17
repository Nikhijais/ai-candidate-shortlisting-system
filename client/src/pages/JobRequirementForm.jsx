import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Target, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';

const JobRequirementForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requiredSkills: '',
    preferredSkills: '',
    minExperience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
        minExperience: Number(formData.minExperience)
      };
      
      const response = await api.post('/match', payload);
      
      // Store basic match results and requirements in localStorage or state to pass to AI page
      localStorage.setItem('matchedCandidates', JSON.stringify(response.data));
      localStorage.setItem('jobRequirements', JSON.stringify(payload));
      
      navigate('/shortlisted');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process requirements');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 rounded-2xl shadow-xl shadow-slate-900/20 border border-slate-700 overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="text-cyan-400" size={32} />
              Job Requirements
            </h2>
            <p className="text-slate-400 mt-2">Define the ideal candidate profile. We'll match against your database and use AI to shortlist.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500"/> Required Skills (comma separated)
              </label>
              <input
                type="text"
                name="requiredSkills"
                required
                value={formData.requiredSkills}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-500"/> Preferred Skills (comma separated)
              </label>
              <input
                type="text"
                name="preferredSkills"
                value={formData.preferredSkills}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="e.g. AWS, Docker, TypeScript"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Target size={16} className="text-amber-500"/> Minimum Experience (Years)
              </label>
              <input
                type="number"
                name="minExperience"
                min="0"
                step="0.1"
                required
                value={formData.minExperience}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3.5 rounded-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Analyzing matches...</>
              ) : (
                <><PlayCircle size={20} /> Match & Generate AI Shortlist</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobRequirementForm;
