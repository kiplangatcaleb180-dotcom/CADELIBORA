import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<{ products: any[] }>('/projects');
        setProducts(res.products || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Enterprise Products</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Production SaaS & AI Platforms</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Enterprise software, neural model workbench, and cloud engines developed and maintained by CADELIBORA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((prod) => (
          <div key={prod.id} className="p-8 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="px-3 py-1 bg-brand-500/10 text-brand-400 rounded-full font-bold">{prod.category}</span>
                <span className="text-emerald-400 font-bold">v{prod.version} ({prod.status})</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{prod.title}</h3>
              <p className="text-xs font-mono text-cyber-accent font-semibold">{prod.tagline}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{prod.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
              <Link to={`/products/${prod.id}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-brand-500/50 hover:text-brand-300">
                Product details <ArrowRight className="h-4 w-4" />
              </Link>
              {prod.demoUrl && (
                <a
                  href={prod.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Launch Product Demo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
