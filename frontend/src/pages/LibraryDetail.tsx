import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Download, Bookmark, ArrowLeft, Check } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';

export const LibraryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchApi<{ resource: any }>(`/library/${id}`);
        if (res.resource) setResource(res.resource);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (saved) {
        await fetchApi(`/library/${id}/save`, { method: 'DELETE' });
        setSaved(false);
      } else {
        await fetchApi(`/library/${id}/save`, { method: 'POST' });
        setSaved(true);
      }
    } catch (err) {
      alert('Failed to update bookmark status');
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-brand-400">Loading Knowledge Resource...</div>;
  if (!resource) return <div className="p-20 text-center text-rose-400 font-mono">Resource not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button onClick={() => navigate('/library')} className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Digital Library</span>
      </button>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="purple">{resource.resourceType}</Badge>
          <span className="font-mono text-xs text-slate-400">Category: {resource.category}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">{resource.title}</h1>
        <p className="text-sm font-mono text-slate-400">Author: {resource.author}</p>
        <p className="text-slate-300 text-base leading-relaxed">{resource.description}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          {resource.downloadUrl && (
            <Button variant="primary">
              <a href={resource.downloadUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                <Download className="w-4 h-4 mr-2" /> Download Document
              </a>
            </Button>
          )}

          <Button variant="outline" onClick={handleSave}>
            <Bookmark className={`w-4 h-4 mr-2 ${saved ? 'fill-brand-400 text-brand-400' : ''}`} />
            <span>{saved ? 'Saved to My Library' : 'Bookmark Resource'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
