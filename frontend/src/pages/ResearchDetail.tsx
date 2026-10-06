import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Layers3,
  Loader2,
  Network,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '../services/apiService';

interface ResearchPublication {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string | null;
  pdfUrl?: string | null;
}

interface LeadResearcher {
  id?: string;
  fullName?: string;
  avatarUrl?: string | null;
  title?: string | null;
}

interface ResearchProject {
  id: string;
  title: string;
  slug: string;
  area: string;
  description: string;
  status: string;
  startYear: number;
  endYear?: number | null;
  tagsJson?: any;
  leadResearcher?: LeadResearcher;
  publications?: ResearchPublication[];
}

interface ResearchDetailResponse {
  success: boolean;
  project: ResearchProject;
}

const areaIcons: Record<string, React.ElementType> = {
  'AI & Reasoning': FlaskConical,
  'Formal Verification': ShieldCheck,
  'Distributed Systems': Network,
  'Cryptographic Systems': Layers3,
};

function getTags(tagsJson: any): string[] {
  if (Array.isArray(tagsJson)) {
    return tagsJson.map(String).filter(Boolean);
  }

  if (typeof tagsJson === 'string') {
    try {
      const parsed = JSON.parse(tagsJson);
      return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  return [];
}

export const ResearchDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError('');

        if (!slug) {
          throw new Error('Research project was not specified.');
        }

        const response = await ApiService.get<ResearchDetailResponse>(
          `/research/projects/${encodeURIComponent(slug)}`
        );

        if (!response.success || !response.project) {
          throw new Error('Research project not found.');
        }

        setProject(response.project);
      } catch (err: any) {
        console.error('Failed to load research project:', err);
        setError(
          err?.message || 'Unable to load this research project.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  const tags = useMemo(
    () => getTags(project?.tagsJson),
    [project?.tagsJson]
  );

  const projectDuration = project
    ? Math.max(
        1,
        (project.endYear || new Date().getFullYear()) - project.startYear + 1
      )
    : 0;

  const publicationCount = project?.publications?.length || 0;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading research project...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] bg-slate-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
              <FlaskConical className="h-7 w-7 text-slate-400" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Research Project Not Found
            </h1>

            <p className="mt-3 text-slate-400">
              {error || 'The requested research project could not be found.'}
            </p>

            <button
              onClick={() => navigate('/research')}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Research
            </button>
          </div>
        </div>
      </div>
    );
  }

  const AreaIcon = areaIcons[project.area] || FlaskConical;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          {/* Breadcrumb */}
          <div className="mb-10 flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/research')}
              className="inline-flex items-center gap-2 text-slate-500 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Research Institute
            </button>

            <span className="text-slate-700">/</span>

            <span className="text-slate-400">
              {project.area}
            </span>

            <span className="text-slate-700">/</span>

            <span className="font-medium text-purple-400">
              {project.title}
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-mono font-bold text-purple-300">
                  <AreaIcon className="h-3.5 w-3.5" />
                  {project.area}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/30 px-3 py-1.5 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {project.status}
                </span>
              </div>

              <h1 className="max-w-5xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
                {project.title}
              </h1>

              <p className="mt-7 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
                {project.description}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                  <CalendarDays className="h-4 w-4 text-purple-400" />
                  {project.startYear} — {project.endYear || 'Present'}
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  {project.publications?.length || 0} Publications
                </span>
              </div>
            </div>

            {/* Research identity card */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-purple-500/10 blur-2xl" />

              <div className="relative rounded-[2rem] border border-slate-800 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-purple-500/20 bg-purple-500/10">
                  <AreaIcon className="h-10 w-10 text-purple-400" />
                </div>

                <div className="mt-7 text-center">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-600">
                    Research Area
                  </p>

                  <p className="mt-2 text-lg font-bold text-white">
                    {project.area}
                  </p>
                </div>

                <div className="mt-7 border-t border-slate-800 pt-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-600">
                    Lead Researcher
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    {project.leadResearcher?.avatarUrl ? (
                      <img
                        src={project.leadResearcher.avatarUrl}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-800">
                        <UserRound className="h-5 w-5 text-slate-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-200">
                        {project.leadResearcher?.fullName ||
                          'Research Institute'}
                      </p>

                      {project.leadResearcher?.title && (
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {project.leadResearcher.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {/* Project metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-600">
                  Started
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {project.startYear}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-600">
                  Duration
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {projectDuration}
                  <span className="ml-1 text-sm font-medium text-slate-500">
                    {projectDuration === 1 ? 'year' : 'years'}
                  </span>
                </p>
              </div>

              <div className="col-span-2 lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-600">
                  Publications
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {publicationCount}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <article className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
                    Research timeline
                  </p>

                  <h2 className="mt-3 text-2xl sm:text-3xl font-black text-white">
                    Project lifecycle
                  </h2>
                </div>

                <Clock3 className="h-6 w-6 shrink-0 text-brand-400" />
              </div>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute left-2 right-2 top-3 h-px bg-slate-800" />

                  <div className="relative flex items-start justify-between">
                    <div className="flex flex-col items-start">
                      <div className="h-6 w-6 rounded-full border-4 border-slate-950 bg-brand-400" />
                      <p className="mt-3 text-xs font-mono text-slate-500">
                        START
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {project.startYear}
                      </p>
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <div
                        className={`h-6 w-6 rounded-full border-4 border-slate-950 ${
                          project.endYear
                            ? 'bg-emerald-400'
                            : 'bg-purple-400 animate-pulse'
                        }`}
                      />
                      <p className="mt-3 text-xs font-mono text-slate-500">
                        {project.endYear ? 'COMPLETED' : 'CURRENT'}
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {project.endYear || 'Present'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Overview */}
            <article className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7 sm:p-9">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                Project overview
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Research context
              </h2>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-400">
                {project.description}
              </p>
            </article>

            {/* Publications */}
            <section>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
                    Knowledge output
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-white">
                    Project publications
                  </h2>
                </div>

                <Link
                  to="/publications"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300"
                >
                  Full archive
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {project.publications?.length ? (
                <div className="space-y-4">
                  {project.publications.map((publication) => (
                    <article
                      key={publication.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-brand-500/30"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-mono text-brand-400">
                          {publication.year}
                        </span>

                        <div className="flex items-center gap-3">
                          {publication.doi && (
                            <a
                              href={`https://doi.org/${publication.doi}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-400"
                            >
                              DOI
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}

                          {publication.pdfUrl && (
                            <a
                              href={publication.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-400"
                            >
                              PDF
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-white">
                        {publication.title}
                      </h3>

                      <p className="mt-2 text-xs font-mono text-slate-500">
                        {publication.journal}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        {publication.abstract}
                      </p>

                      <p className="mt-5 text-xs text-slate-500">
                        {publication.authors}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-4 text-sm text-slate-500">
                    No publications are currently associated with this project.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600">
                Project metadata
              </p>

              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-xs text-slate-600">Status</dt>
                  <dd className="mt-1 text-sm font-semibold text-emerald-400">
                    {project.status}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-600">Research area</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-200">
                    {project.area}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-600">Started</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-200">
                    {project.startYear}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-600">Completion</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-200">
                    {project.endYear || 'Ongoing'}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-600">Publications</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-200">
                    {project.publications?.length || 0}
                  </dd>
                </div>
              </dl>
            </div>

            {tags.length > 0 && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600">
                  Research tags
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/research"
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-sm font-semibold text-slate-300 transition hover:border-purple-500/30 hover:text-white"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                All research
              </span>

              <ArrowRight className="h-4 w-4 text-slate-600" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
};
