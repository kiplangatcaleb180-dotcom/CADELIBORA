import React, { useEffect, useState } from 'react';
import { Cpu, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, EmptyState } from '../../components/ui';
import { fetchApi } from '../../lib/api';

export const DashboardResearchPage: React.FC = () => {
  const [researchProjects, setResearchProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<{ projects: any[] }>('/research/my-projects')
      .then((res) => setResearchProjects(res.projects || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full">
      <section className="w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
            <Cpu className="w-4 h-4" />
            <span>Research Workspace</span>
          </div>
          <h1 className="text-3xl font-black text-white">Research Initiatives & Bookmarks</h1>
        </div>

        {researchProjects.length === 0 ? (
          <EmptyState
            title="No saved research projects"
            description="Explore CADELIBORA's scientific research initiatives and publications."
            actionLabel="Explore Research"
            onAction={() => window.location.href = '/research'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchProjects.map((p) => (
              <Card key={p.id} hoverEffect className="space-y-4">
                <CardHeader>
                  <Badge variant="cyan">{p.area}</Badge>
                  <CardTitle className="text-xl font-bold mt-2">{p.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href="/research"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    View Initiative <ArrowRight className="w-4 h-4 ml-1.5" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
