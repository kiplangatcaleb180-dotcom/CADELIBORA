import React, { useState } from 'react';
import { BookOpen, Search, Layers, Cpu, Shield, Code, Sparkles, HelpCircle } from 'lucide-react';

export const KnowledgeCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'glossary' | 'guides' | 'concepts'>('concepts');

  const topics = [
    { title: 'Zero-Trust Workload Identity', area: 'Cybersecurity', desc: 'Ephemeral mTLS certification and SPIFFE/SPIRE architecture.' },
    { title: 'Neuro-Symbolic Reasoning', area: 'Artificial Intelligence', desc: 'Combining deep neural networks with formal symbolic logic provers.' },
    { title: 'Lattice-Based Post-Quantum Cryptography', area: 'Cryptography', desc: 'Resilience against quantum computing attacks using learning with errors (LWE).' },
    { title: 'Distributed Micro-Kernel Runtimes', area: 'Systems Engineering', desc: 'Rust and WebAssembly edge execution nodes with zero-copy IPC.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-cyber-accent">Technical Knowledge Base</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Engineering Concepts & Guides</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Cross-linked repository of computer science concepts, architecture specifications, and engineering guidelines.
        </p>
      </div>

      <div className="flex justify-center gap-2 font-mono text-xs">
        {[
          { id: 'concepts', label: '1. Core Concepts' },
          { id: 'guides', label: '2. Architecture Guides' },
          { id: 'glossary', label: '3. Technical Glossary' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-5 py-2.5 rounded-xl transition-all ${
              activeTab === t.id ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {topics.map((item, idx) => (
          <div key={idx} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-3">
            <span className="px-3 py-1 bg-brand-500/10 text-brand-400 font-mono text-xs font-bold rounded-full">{item.area}</span>
            <h3 className="text-2xl font-bold text-white">{item.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
