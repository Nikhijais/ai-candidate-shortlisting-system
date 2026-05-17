import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CandidateForm from './pages/CandidateForm';
import JobRequirementForm from './pages/JobRequirementForm';
import ShortlistedDashboard from './pages/ShortlistedDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-candidate" element={<CandidateForm />} />
            <Route path="/job-requirements" element={<JobRequirementForm />} />
            <Route path="/shortlisted" element={<ShortlistedDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
