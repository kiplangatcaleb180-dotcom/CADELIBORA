import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Cpu, Shield, Sparkles, GraduationCap, Code, Layers, FileText, X, ArrowRight } from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [coursesRes, researchRes, libraryRes] = await Promise.all([
          fetchApi<{ courses: any[] }>(`/courses?search=${encodeURIComponent(query)}`),
          fetchApi<{ projects: any[] }>(`/research/projects?search=${encodeURIComponent(query)}`),
          fetchApi<{ resources: any[] }>(`/library?search=${encodeURIComponent(query)}`),
        ]);

        const combined = [
          ...(coursesRes.courses || []).map((c) => ({ ...c, type: 'Course', icon: GraduationCap, link: `/academy/courses/${c.slug}` })),
          ...(researchRes.projects || []).map((r) => ({ ...r, type: 'Research', icon: Cpu, link: `/research` })),
          ...(libraryRes.resources || []).map((l) => ({ ...l, type: 'Library Resource', icon: BookOpen, link: `/library/${l.id}` })),
        ];

        setResults(combined);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/80 backdrop-blur-md px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-brand-400 mr-3" />
          <input
            type="text"
            placeholder="Global search across AI, courses, research, docs, projects... (Ctrl + K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                navigate(`/search?q=${encodeURIComponent(query)}`);
                onClose();
              }
            }}
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {!query.trim() && (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Sparkles className="w-8 h-8 mx-auto text-brand-400 mb-2 animate-bounce" />
              <p>Type keywords to search across CADELIBORA ecosystem...</p>
              <div className="flex justify-center gap-2 mt-4 text-xs">
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">AI Agents</span>
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Cybersecurity</span>
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Quantum</span>
              </div>
            </div>
          )}

          {loading && <p className="text-center py-6 text-brand-400 text-sm animate-pulse">Searching CADELIBORA Index...</p>}

          {!loading && query.trim() && (
            <div
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(query)}`);
                onClose();
              }}
              className="p-3 bg-brand-600/20 border border-brand-500/50 rounded-xl text-xs font-bold text-brand-400 hover:bg-brand-600/30 cursor-pointer flex items-center justify-between"
            >
              <span>View all results on Global Search page for "{query}"</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}

          {results.map((item, idx) => {
            const IconComponent = item.icon || FileText;
            return (
              <div
                key={idx}
                onClick={() => {
                  navigate(item.link);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-brand-500/30 transition-all"
              >
                <div className="p-2 bg-brand-500/10 rounded-lg text-brand-400">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{item.title}</p>
                  <p className="text-xs text-slate-400 truncate">{item.description || item.summary || item.type}</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono font-bold bg-slate-800 text-brand-400 border border-slate-700 rounded-full">
                  {item.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
