import React from 'react';
import { Globe, MapPin, Users, Award, Server } from 'lucide-react';

export const GlobalCenter: React.FC = () => {
  const hubs = [
    { city: 'San Francisco, CA', role: 'Global Innovation & Executive HQ', team: '25 Researchers & Architects' },
    { city: 'Zurich, Switzerland', role: 'AI Research Institute & Formal Logic Lab', team: '18 Applied Scientists' },
    { city: 'Seattle, WA', role: 'Software Academy & Cloud Infrastructure Hub', team: '30 Engineers & Instructors' },
    { city: 'Austin, TX', role: 'Enterprise Security & Consulting Operations', team: '20 Security Engineers' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">Global Presence</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">International Nodes & Labs</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          CADELIBORA operates research laboratories, edge compute nodes, and academy fellowships across North America and Europe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hubs.map((hub, idx) => (
          <div key={idx} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center gap-3 text-brand-400">
              <MapPin className="w-5 h-5" />
              <h3 className="text-xl font-bold text-white font-sans">{hub.city}</h3>
            </div>
            <p className="text-xs text-slate-300">{hub.role}</p>
            <p className="text-[11px] text-emerald-400 font-bold">{hub.team}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
