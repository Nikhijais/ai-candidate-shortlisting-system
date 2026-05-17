import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, Briefcase, Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Candidates', path: '/', icon: <Users size={18} /> },
    { name: 'Add Candidate', path: '/add-candidate', icon: <UserPlus size={18} /> },
    { name: 'Match Requirements', path: '/job-requirements', icon: <Briefcase size={18} /> },
    { name: 'AI Shortlist', path: '/shortlisted', icon: <Sparkles size={18} /> },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              AI Recruiter
            </span>
          </div>
          <div className="flex space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
