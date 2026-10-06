import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { Search as SearchIcon, ArrowRight, BookOpen, Cpu, FolderGit2, BookMarked, MessageSquare, User, Sparkles } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '../components/ui';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(queryParam);
  const [type, setType] = useState(typeParam);
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const performSearch = async (q: string, t: string) => {
    if (!q.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchApi<{ success: boolean; total: number; results: any[] }>(
        `/search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(t)}`
      );
      if (res.success) {
        setResults(res.results || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery(queryParam);
    setType(typeParam);
    performSearch(queryParam, typeParam);
  }, [queryParam, typeParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query, type });
  };

  const categories = [
    { id: 'all', label: 'All Results' },
    { id: 'course', label: 'Courses' },
    { id: 'research', label: 'Research' },
    { id: 'project', label: 'Projects' },
    { id: 'library', label: 'Library' },
    { id: 'community', label: 'Community' },
    { id: 'person', label: 'People' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">CADELIBORA Discovery</h1>
        <h2 className="text-3xl sm:text-4xl font-black text-white">Global Ecosystem Search</h2>
        <p className="text-slate-300 text-sm">
          Search across courses, research projects, open-source software, digital library specs, and community discussions.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
        <div className="flex-1 flex items-center px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl">
          <SearchIcon className="w-5 h-5 text-brand-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search knowledge, courses, projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary">Search</Button>
      </form>

      {/* Filters */}
      <div className="flex justify-center gap-2 text-xs font-mono overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setType(cat.id);
              setSearchParams({ q: queryParam, type: cat.id });
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              type === cat.id ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results View */}
      {loading ? (
        <p className="text-center py-16 text-brand-400 font-mono text-sm animate-pulse">Searching CADELIBORA knowledge graph...</p>
      ) : !queryParam ? (
        <div className="text-center py-16 text-slate-500 font-mono text-xs">
          Enter a query above to start exploring the platform.
        </div>
      ) : results.length === 0 ? (
        <EmptyState title={`No results found for "${queryParam}"`} description="Try searching with different technical keywords or category filters." />
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          <p className="text-xs font-mono text-slate-400">Found {total} results for "{queryParam}"</p>
          {results.map((r) => (
            <div key={r.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-2 flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <Badge variant="blue">{r.type.toUpperCase()}</Badge>
                <h3 className="text-lg font-bold text-white hover:text-brand-400 transition-colors">
                  <Link to={r.url}>{r.title}</Link>
                </h3>
                {r.description && <p className="text-xs text-slate-300 line-clamp-2">{r.description}</p>}
              </div>

              <Button variant="outline" size="sm">
                <Link to={r.url} className="inline-flex items-center">
                  View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
