import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { BookOpen, Search, Download, FileText, ArrowRight } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '../components/ui';

export const Library: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  const loadResources = async () => {
    setLoading(true);
    try {
      let query = `/library?`;
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (type) query += `type=${encodeURIComponent(type)}&`;

      const res = await fetchApi<{ resources: any[] }>(query);
      setResources(res.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [type]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Knowledge Center</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Digital Library & Technical Specs</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Peer-reviewed research whitepapers, architecture specs, software ebooks, and technical guidelines.
        </p>
      </div>

      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-brand-400" />
          <input
            type="text"
            placeholder="Search digital library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadResources()}
            className="bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex gap-2 text-xs font-mono overflow-x-auto pb-2 sm:pb-0">
          {['', 'Whitepaper', 'Book', 'Architecture Spec'].map((t, idx) => (
            <button
              key={idx}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                type === t ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {t || 'All Formats'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-brand-400 font-mono text-sm animate-pulse">Loading Digital Library...</p>
      ) : resources.length === 0 ? (
        <EmptyState title="No resources found" description="Explore CADELIBORA's digital library repository." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res) => (
            <div key={res.id} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Badge variant="purple">{res.resourceType}</Badge>
                <h3 className="text-xl font-bold text-white hover:text-brand-400 transition-colors">
                  <Link to={`/library/${res.id}`}>{res.title}</Link>
                </h3>
                <p className="text-xs font-mono text-slate-400">Author: {res.author}</p>
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{res.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {res.downloadUrl ? (
                  <a
                    href={res.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white"
                  >
                    <Download className="w-4 h-4" /> Download
                  </a>
                ) : <span />}

                <Button variant="outline" size="sm">
                  <Link to={`/library/${res.id}`} className="inline-flex items-center">
                    View <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
