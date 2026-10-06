import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Download, ArrowRight, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '../../components/ui';
import { fetchApi } from '../../lib/api';

export const DashboardLibraryPage: React.FC = () => {
  const [savedResources, setSavedResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const res = await fetchApi<{ resources: any[] }>('/library/saved');
      setSavedResources(res.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleUnsave = async (id: string) => {
    try {
      await fetchApi(`/library/${id}/save`, { method: 'DELETE' });
      loadSaved();
    } catch (err) {
      alert('Failed to remove resource');
    }
  };

  return (
    <div className="w-full">
      <section className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase mb-1">
              <BookMarked className="w-4 h-4" />
              <span>Personal Knowledge Base</span>
            </div>
            <h1 className="text-3xl font-black text-white">My Saved Resources</h1>
          </div>
          <Button variant="primary">
            <Link to="/library">Explore Digital Library</Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-brand-400 font-mono text-sm animate-pulse">Loading saved resources...</p>
        ) : savedResources.length === 0 ? (
          <EmptyState
            title="No saved resources yet"
            description="Bookmark whitepapers, documentation, and specs from the Digital Library to access them here."
            actionLabel="Browse Library"
            onAction={() => window.location.href = '/library'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedResources.map((r) => (
              <Card key={r.id} hoverEffect className="space-y-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="purple">{r.resourceType}</Badge>
                    <button
                      onClick={() => handleUnsave(r.id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <CardTitle className="text-xl font-bold mt-2">
                    <Link to={`/library/${r.id}`}>{r.title}</Link>
                  </CardTitle>
                  <CardDescription>{r.author} • {r.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300 line-clamp-2">{r.description}</p>
                  <div className="flex items-center gap-3 pt-2">
                    {r.downloadUrl && (
                      <a
                        href={r.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    )}
                    <Button variant="outline" size="sm">
                      <Link to={`/library/${r.id}`} className="inline-flex items-center">
                        View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
