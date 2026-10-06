import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Shield, Globe, Terminal, Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-color)] text-[var(--text-muted)] pt-16 pb-12 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Org Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyber-accent to-cyber-neon p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <span className="text-xl font-black tracking-wider text-white font-mono">CADELIBORA</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed pr-6">
            CADELIBORA is an international technology organization, research institute, digital academy, AI ecosystem, and software engineering hub advancing human capability through open research, autonomous intelligence, and secure distributed infrastructure.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-brand-400 hover:border-brand-500/40">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-brand-400 hover:border-brand-500/40">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-brand-400 hover:border-brand-500/40">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 1: Organization */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider mb-4">Organization</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/organization" className="hover:text-brand-400 transition-colors">About CADELIBORA</Link></li>
            <li><Link to="/organization" className="hover:text-brand-400 transition-colors">Vision & Mission</Link></li>
            <li><Link to="/organization" className="hover:text-brand-400 transition-colors">Leadership & Founder</Link></li>
            <li><Link to="/organization" className="hover:text-brand-400 transition-colors">Global Milestones</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Services & Consulting</Link></li>
          </ul>
        </div>

        {/* Column 2: R&D & AI */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider mb-4">Research & AI</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/research" className="hover:text-brand-400 transition-colors">Research Projects</Link></li>
            <li><Link to="/research" className="hover:text-brand-400 transition-colors">Publications & DOI</Link></li>
            <li><Link to="/ai" className="hover:text-brand-400 transition-colors">AI Assistant & Lab</Link></li>
            <li><Link to="/ai" className="hover:text-brand-400 transition-colors">AI Playground</Link></li>
            <li><Link to="/innovation" className="hover:text-brand-400 transition-colors">Innovation Center</Link></li>
          </ul>
        </div>

        {/* Column 3: Academy & Developers */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider mb-4">Academy & Devs</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/academy" className="hover:text-brand-400 transition-colors">Course Catalog</Link></li>
            <li><Link to="/library" className="hover:text-brand-400 transition-colors">Digital Knowledge Base</Link></li>
            <li><Link to="/developers" className="hover:text-brand-400 transition-colors">Developer Center & APIs</Link></li>
            <li><Link to="/community" className="hover:text-brand-400 transition-colors">Community Forum</Link></li>
            <li><Link to="/news" className="hover:text-brand-400 transition-colors">Newsroom & Events</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono">
        <p>© {new Date().getFullYear()} CADELIBORA Organization. All rights reserved.</p>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
          <span className="hover:text-slate-400 cursor-pointer">Security Compliance</span>
          <span className="hover:text-slate-400 cursor-pointer">API Terms</span>
        </div>
      </div>
    </footer>
  );
};
