import React, { useEffect, useState } from 'react';
import { FolderGit2, ArrowRight, ExternalLink } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  EmptyState,
} from '../../components/ui';
import { fetchApi } from '../../lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
}

export const DashboardProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchApi<{ projects: Project[] }>('/projects');
        setProjects(res.projects || []);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="w-full">

      <section className="w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-400 font-bold uppercase mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Project Workspace</span>
          </div>

          <h1 className="text-3xl font-black text-white">
            CADELIBORA Projects
          </h1>

          <p className="mt-2 text-slate-400 max-w-2xl">
            Explore CADELIBORA's open-source and enterprise engineering
            projects from your workspace.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-brand-400">
            Loading Projects...
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects available"
            description="There are currently no published CADELIBORA projects to explore."
            actionLabel="Explore Projects"
            onAction={() => {
              window.location.href = '/projects';
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                hoverEffect
                className="space-y-4"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="blue">{project.category}</Badge>

                    {project.featured && (
                      <Badge variant="emerald">Featured</Badge>
                    )}
                  </div>

                  <CardTitle className="text-xl font-bold mt-2">
                    {project.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        (window.location.href = `/projects/${project.id}`)
                      }
                    >
                      View Project
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Repository
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Live Project
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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
