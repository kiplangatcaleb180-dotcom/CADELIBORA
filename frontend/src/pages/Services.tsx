import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Cpu, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<{ services: any[] }>('/services');
        setServices(res.services || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Enterprise Consulting</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Professional Services & Solutions</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Custom AI model fine-tuning, zero-trust cybersecurity architecture, and enterprise software engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((s) => {
          let features: string[] = [];
          if (Array.isArray(s.featuresJson)) {
            features = s.featuresJson;
          } else if (typeof s.featuresJson === 'string') {
            try {
              const parsed = JSON.parse(s.featuresJson);
              features = Array.isArray(parsed) ? parsed : [];
            } catch {
              features = s.featuresJson
                .split('\\n')
                .map((item: string) => item.trim())
                .filter(Boolean);
            }
          }

          return (
            <div key={s.id} className="p-8 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">{s.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{s.fullDesc}</p>

              <div className="space-y-2 pt-2 font-mono text-xs text-slate-200">
                {features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link to={`/services/${s.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 pt-2 hover:underline">
                Service details and request <ArrowRight className="w-4 h-4" />
              </Link>

              <Link to="/case-studies" className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 pt-2 hover:underline">
                <span>View Related Case Studies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
