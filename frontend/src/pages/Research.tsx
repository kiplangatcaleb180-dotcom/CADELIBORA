import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Cpu,
  ExternalLink,
  FlaskConical,
  Layers3,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

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
  leadResearcher?: {
    fullName?: string;
    avatarUrl?: string | null;
    title?: string | null;
  };
}

interface Publication {
  id: string;
  title: string;
  abstract: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string | null;
  pdfUrl?: string | null;
  researchProjectId?: string | null;
}

const researchAreas = [
  {
    title: 'AI & Reasoning',
    description:
      'Exploring neural, symbolic, and hybrid approaches to machine reasoning and intelligent systems.',
    icon: BrainCircuit,
  },
  {
    title: 'Formal Verification',
    description:
      'Studying techniques for proving software properties and improving reliability in complex systems.',
    icon: ShieldCheck,
  },
  {
    title: 'Distributed Systems',
    description:
      'Investigating scalable architectures, edge computing, coordination, and resilient infrastructure.',
    icon: Network,
  },
  {
    title: 'Cryptographic Systems',
    description:
      'Researching secure computation, modern cryptographic constructions, and post-quantum security.',
    icon: Layers3,
  },
];

const methodology = [
  'Problem formulation and literature analysis',
  'Prototype implementation and experimental evaluation',
  'Formal reasoning, verification, and reproducibility',
  'Open technical documentation and publication',
];

export const Research: React.FC = () => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [projectResponse, publicationResponse] = await Promise.all([
          fetchApi<{ projects: ResearchProject[] }>('/research/projects'),
          fetchApi<{ publications: Publication[] }>('/research/publications'),
        ]);

        setProjects(projectResponse.projects || []);
        setPublications(publicationResponse.publications || []);
      } catch (error) {
        console.error('Failed to load Research data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const areas = useMemo(() => {
    const values = projects.map((project) => project.area).filter(Boolean);
    return Array.from(new Set(values));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter((project) =>
      [
        project.title,
        project.area,
        project.description,
        project.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [projects, search]);

  const ongoingCount = projects.filter(
    (project) => project.status?.toLowerCase() === 'ongoing'
  ).length;

  const latestPublications = publications
    .slice()
    .sort((a, b) => b.year - a.year)
    .slice(0, 3);

  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.14),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(34,211,238,0.08),transparent_32%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase">
                <FlaskConical className="w-3.5 h-3.5" />
                CADELIBORA Research Institute
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95]">
                  Research for
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-brand-400 to-cyan-400">
                    intelligent systems.
                  </span>
                </h1>

                <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
                  CADELIBORA investigates foundational and applied problems
                  across artificial intelligence, formal methods, distributed
                  computing, security, and emerging technology.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-400 transition-colors"
                >
                  Explore research
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/publications"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-200 font-bold text-sm hover:border-slate-600 hover:bg-slate-800 transition-colors"
                >
                  Publications archive
                  <BookOpen className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 bg-purple-500/10 blur-3xl rounded-full" />

              <div className="relative rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                      Research Index
                    </p>
                    <p className="mt-1 text-white font-bold">
                      Live institute overview
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-3xl font-black text-white">
                      {projects.length}
                    </p>
                    <p className="mt-1 text-xs font-mono text-slate-500 uppercase">
                      Research projects
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-3xl font-black text-white">
                      {publications.length}
                    </p>
                    <p className="mt-1 text-xs font-mono text-slate-500 uppercase">
                      Publications
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-3xl font-black text-white">
                      {ongoingCount}
                    </p>
                    <p className="mt-1 text-xs font-mono text-slate-500 uppercase">
                      Ongoing
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-3xl font-black text-white">
                      {areas.length}
                    </p>
                    <p className="mt-1 text-xs font-mono text-slate-500 uppercase">
                      Research areas
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Research index operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
            Research domains
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
            Questions that span disciplines.
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Our research program connects theoretical investigation with
            engineering experimentation, creating a path from difficult
            questions to reproducible systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {researchAreas.map((area) => {
            const Icon = area.icon;

            return (
              <div
                key={area.title}
                className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/30 hover:bg-slate-900 transition-all"
              >
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  {area.title}
                </h3>

                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Projects */}
      <section
        id="projects"
        className="border-y border-slate-800/80 bg-slate-950/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
                Active research
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                Research initiatives
              </h2>
              <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed">
                Current projects, research directions, and technical
                investigations maintained by the institute.
              </p>
            </div>

            <div className="w-full lg:w-80 flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-800 bg-slate-900/70">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search research..."
                className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-10 grid md:grid-cols-2 gap-5">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-64 rounded-3xl border border-slate-800 bg-slate-900/50 animate-pulse"
                />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
              <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="mt-4 text-lg font-bold text-white">
                {search ? 'No matching research projects' : 'No research projects yet'}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? 'Try a different search term.'
                  : 'Research initiatives will appear here as they are published.'}
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/research/${encodeURIComponent(project.slug)}`}
                  className="group block rounded-3xl border border-slate-800 bg-slate-900/60 p-7 sm:p-8 hover:border-brand-500/30 hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <article>
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-bold">
                      {project.area}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {project.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl sm:text-2xl font-black text-white group-hover:text-brand-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-7 pt-5 border-t border-slate-800 grid sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <p className="text-slate-600 uppercase">Lead researcher</p>
                      <p className="mt-1 text-slate-300">
                        {project.leadResearcher?.fullName || 'Research Institute'}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-600 uppercase">Timeline</p>
                      <p className="mt-1 text-slate-300">
                        {project.startYear} — {project.endYear || 'Present'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-400 opacity-80 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    Explore project
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Methodology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-purple-500/10 via-slate-900/70 to-slate-950 p-8 sm:p-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-purple-400" />
            </div>

            <p className="mt-8 text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
              Research methodology
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              From hypothesis to reproducible systems.
            </h2>

            <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed">
              CADELIBORA combines scientific investigation with practical
              systems engineering. Research outputs are structured so that
              ideas can be evaluated, implemented, documented, and extended.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-10">
            <div className="space-y-5">
              {methodology.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-xs font-mono text-brand-400">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="pt-1">
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                to="/publications"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300"
              >
                Browse published work
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Publications preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
              Knowledge output
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
              Latest publications
            </h2>
          </div>

          <Link
            to="/publications"
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300"
          >
            View full archive
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {latestPublications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
            <BookOpen className="w-9 h-9 text-slate-600 mx-auto" />
            <p className="mt-4 text-sm text-slate-500">
              Publications will appear here as the research archive grows.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {latestPublications.map((publication) => (
              <article
                key={publication.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-purple-400">
                    {publication.year}
                  </span>

                  {publication.doi && (
                    <a
                      href={`https://doi.org/${publication.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open DOI for ${publication.title}`}
                      className="text-slate-500 hover:text-purple-400"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h3 className="mt-5 text-lg font-bold text-white leading-snug">
                  {publication.title}
                </h3>

                <p className="mt-3 text-xs font-mono text-slate-500">
                  {publication.journal}
                </p>

                <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-4">
                  {publication.abstract}
                </p>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 line-clamp-1">
                    {publication.authors}
                  </span>

                  <Link
                    to="/publications"
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-brand-400"
                  >
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
