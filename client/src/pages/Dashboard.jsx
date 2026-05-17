import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, Mail, Briefcase, FileText } from 'lucide-react';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get('/candidates');
        setCandidates(response.data);
      } catch (err) {
        setError('Failed to fetch candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
    </div>
  );

  if (error) return (
    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">All Candidates</h1>
        <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
          Total: {candidates.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map(candidate => (
          <div key={candidate._id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
            <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
              {candidate.name}
            </h2>
            
            <div className="mt-4 space-y-3 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-500" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-slate-500" />
                <span>{candidate.experience} years experience</span>
              </div>
              <div className="flex items-start gap-2">
                <FileText size={16} className="text-slate-500 mt-1 shrink-0" />
                <p className="line-clamp-2">{candidate.projectsBio}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs uppercase font-semibold text-slate-500 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.slice(0, 5).map((skill, index) => (
                  <span key={index} className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 5 && (
                  <span className="bg-slate-700/50 text-slate-400 px-2 py-1 rounded text-xs">
                    +{candidate.skills.length - 5}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700/50">
            No candidates found. Please add some to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
