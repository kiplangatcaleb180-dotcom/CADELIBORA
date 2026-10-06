import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import { Code, Github, ExternalLink, Terminal, ArrowRight } from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from '../components/ui';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchApi<{ projects: any[] }>('/projects');
        setProjects(res.projects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-cyber-neon">Open Source Engineering</h1>
        <h2 className="text-3xl sm:text-5xl font-black text-white">Active Software Projects</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Open source libraries, micro-kernel engines, and developer tools built by CADELIBORA engineers.
        </p>
      </div>

      {loading ? (
        <p className="text-center py-12 text-brand-400 font-mono text-sm animate-pulse">Loading CADELIBORA projects...</p>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" description="Explore open source and enterprise software projects." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => {
            let stack: string[] = [];
            try {
              stack = JSON.parse(proj.techStackJson || '[]');
            } catch (e) {
              stack = [];
            }

            return (
              <div key={proj.id} className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <Badge variant="cyan">{proj.category}</Badge>
                    <span className="text-brand-400 font-bold">{proj.status}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white hover:text-brand-400 transition-colors">
                    <Link to={`/projects/${proj.id}`}>{proj.title}</Link>
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{proj.description}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {stack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded font-mono text-[11px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  {proj.repoUrl ? (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono text-brand-400 hover:underline"
                    >
                      <Github className="w-4 h-4" />
                      <span>Repository</span>
                    </a>
                  ) : <span />}

                  <Button variant="outline" size="sm">
                    <Link to={`/projects/${proj.id}`} className="inline-flex items-center">
                      View Details <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
