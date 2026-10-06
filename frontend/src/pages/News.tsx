import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';

export const News: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<{ articles: any[] }>('/articles');
        setArticles(res.articles || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Newsroom & Media</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Press Releases & Announcements</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Latest developments, research releases, and organization updates from CADELIBORA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((art) => (
          <div key={art.id} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <span className="px-3 py-1 bg-brand-500/10 text-brand-400 text-xs font-mono font-bold rounded-full">{art.category}</span>
            <h3 className="text-xl font-bold text-white">{art.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{art.summary}</p>
            <div className="pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
              Published by: {art.author?.fullName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
