import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Award, CheckCircle2, TrendingUp } from 'lucide-react';

export const CaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<{ caseStudies: any[] }>('/services');
        setCaseStudies(res.caseStudies || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-cyber-accent">Proven Outcomes</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Enterprise Case Studies</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Documented transformations and metric results achieved by organizations using CADELIBORA systems.
        </p>
      </div>

      <div className="space-y-8">
        {caseStudies.map((cs) => {
          let results: string[] = [];
          if (Array.isArray(cs.resultsJson)) {
            results = cs.resultsJson;
          } else if (typeof cs.resultsJson === 'string') {
            try {
              const parsed = JSON.parse(cs.resultsJson);
              results = Array.isArray(parsed) ? parsed : [];
            } catch {
              results = cs.resultsJson
                .split('\\n')
                .map((item: string) => item.trim())
                .filter(Boolean);
            }
          }

          return (
            <div key={cs.id} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <div>
                  <span className="text-xs font-mono text-brand-400 font-bold uppercase tracking-wider">{cs.clientName} ({cs.industry})</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{cs.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <p className="font-bold text-rose-400 font-mono uppercase">1. System Challenge:</p>
                  <p className="leading-relaxed text-slate-300">{cs.challenge}</p>
                </div>
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <p className="font-bold text-emerald-400 font-mono uppercase">2. CADELIBORA Solution:</p>
                  <p className="leading-relaxed text-slate-300">{cs.solution}</p>
                </div>
              </div>

              {results.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs font-mono font-bold text-cyber-accent mb-3 uppercase">Verified Outcome Metrics:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {results.map((res, i) => (
                      <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
