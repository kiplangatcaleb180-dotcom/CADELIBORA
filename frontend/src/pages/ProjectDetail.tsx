import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { FolderGit2, Github, ExternalLink, ArrowLeft, Terminal, Cpu } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ project: any }>(`/projects/${id}`)
      .then((res) => setProject(res.project))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-20 text-center font-mono text-brand-400">Loading Project Profile...</div>;
  if (!project) return <div className="p-20 text-center text-rose-400 font-mono">Project not found.</div>;

  let stack: string[] = [];

  try {
    if (Array.isArray(project.techStackJson)) {
      stack = project.techStackJson.filter(
        (tech: unknown): tech is string => typeof tech === 'string'
      );
    } else if (typeof project.techStackJson === 'string') {
      const parsed = JSON.parse(project.techStackJson || '[]');

      if (Array.isArray(parsed)) {
        stack = parsed.filter(
          (tech: unknown): tech is string => typeof tech === 'string'
        );
      }
    }
  } catch {
    stack = [];
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="blue">{project.category}</Badge>
          <span className="font-mono text-xs text-brand-400 font-bold">{project.status}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">{project.title}</h1>
        <p className="text-slate-300 text-base leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {stack.map((tech, idx) => (
            <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 text-brand-400 rounded-lg font-mono text-xs">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          {project.repoUrl && (
            <Button variant="primary">
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                <Github className="w-4 h-4 mr-2" /> View Repository
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline">
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
