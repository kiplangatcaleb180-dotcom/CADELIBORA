import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { BookOpen, ExternalLink, Download, Search, Tag, FileText } from 'lucide-react';

export const Publications: React.FC = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<{ publications: any[] }>('/research/publications');
        setPublications(res.publications || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const filtered = publications.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.authors.toLowerCase().includes(search.toLowerCase()) ||
    p.journal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">Academic & Research Archive</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Peer-Reviewed Publications</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Scientific articles, DOI registered papers, technical reports, and computer science treatises published by CADELIBORA researchers.
        </p>
      </div>

      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center gap-2 max-w-xl mx-auto font-mono text-xs">
        <Search className="w-4 h-4 text-purple-400" />
        <input
          type="text"
          placeholder="Search publications by title, author, or journal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      <div className="space-y-6">
        {filtered.map((pub) => (
          <div key={pub.id} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-white hover:text-brand-400 cursor-pointer">{pub.title}</h3>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full font-mono text-xs font-bold shrink-0">
                {pub.journal} ({pub.year})
              </span>
            </div>

            <p className="text-xs font-mono text-slate-400">Authors: {pub.authors}</p>
            <p className="text-sm text-slate-300 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
              {pub.abstract}
            </p>

            <div className="pt-2 flex items-center justify-between font-mono text-xs">
              {pub.doi && (
                <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-cyber-accent hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>DOI: {pub.doi}</span>
                </a>
              )}
              <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-brand-400 hover:bg-slate-800 flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                <span>PDF Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
