import React from 'react';
import { Film, Image, Download, Shield, Sparkles } from 'lucide-react';

export const MediaCenter: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Press & Brand Assets</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Media Center</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Official logos, executive photos, press kits, and media guidelines for CADELIBORA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Image className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Brand Assets & Logos</h3>
          <p className="text-sm text-slate-300">Download high-resolution SVG and PNG logos, brand guidelines, and color palettes.</p>
          <button className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs font-mono flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Download Brand Kit (.ZIP)</span>
          </button>
        </div>

        <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyber-accent/10 border border-cyber-accent/30 flex items-center justify-center text-cyber-accent">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Press Kit & Fact Sheet</h3>
          <p className="text-sm text-slate-300">Executive bios, institutional background, and press contact information.</p>
          <button className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white font-bold text-xs font-mono flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Download Press Factsheet (.PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
