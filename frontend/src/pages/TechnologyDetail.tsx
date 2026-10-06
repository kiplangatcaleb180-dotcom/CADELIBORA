import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
  Loader2,
  Server,
  Tag,
  Globe,
  BookMarked,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '../services/apiService';

interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  icon?: string | null;
  websiteUrl?: string | null;
  docsUrl?: string | null;
  version?: string | null;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
}

interface TechnologyDomain {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface TechnologySection {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
}

interface DomainRelation {
  domainId: string;
  domain: TechnologyDomain;
  sortOrder: number;
}

interface SectionRelation {
  sectionId: string;
  section: TechnologySection;
  sortOrder: number;
}

interface TechnologyDetailResponse {
  success: boolean;
  technology: Technology;
  relatedTechnologies: Technology[];
}

export const TechnologyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [technology, setTechnology] = useState<Technology | null>(null);
  const [domains, setDomains] = useState<DomainRelation[]>([]);
  const [sections, setSections] = useState<SectionRelation[]>([]);
  const [relatedTechnologies, setRelatedTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTechnology = async () => {
      try {
        setLoading(true);
        setError('');

        if (!slug) {
          throw new Error('Technology was not specified.');
        }

        const response = await ApiService.get<TechnologyDetailResponse>(
          `/technology/${encodeURIComponent(slug)}`
        );

        if (!response.success || !response.technology) {
          throw new Error('Technology not found.');
        }

        setTechnology(response.technology);

        const tech = response.technology as Technology & {
          domains?: DomainRelation[];
          sections?: SectionRelation[];
        };

        setDomains(tech.domains || []);
        setSections(tech.sections || []);
        setRelatedTechnologies(response.relatedTechnologies || []);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message || 'Unable to load this technology.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadTechnology();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading technology...</span>
        </div>
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
            <Layers className="h-7 w-7 text-slate-400" />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Technology Not Found
          </h1>

          <p className="mt-3 text-slate-400">
            {error || 'The requested technology could not be found.'}
          </p>

          <button
            onClick={() => navigate('/technology')}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Technology
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-brand-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/5 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={() => navigate('/technology')}
              className="inline-flex items-center gap-2 text-slate-500 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Technology Center
            </button>

            <span className="text-slate-700">/</span>

            <span className="text-slate-400">
              {technology.category}
            </span>

            <span className="text-slate-700">/</span>

            <span className="font-medium text-brand-400">
              {technology.name}
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm">
                  {technology.category}
                </span>

                {technology.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Featured Technology
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                {technology.name}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
                {technology.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {technology.version && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-300 backdrop-blur-sm">
                    <Tag className="h-4 w-4 text-brand-400" />
                    Version {technology.version}
                  </span>
                )}

                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-300 backdrop-blur-sm">
                  <Server className="h-4 w-4 text-brand-400" />
                  {technology.category}
                </span>

                {technology.websiteUrl && (
                  <a
                    href={technology.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-2.5 text-sm font-semibold text-brand-400 transition hover:border-brand-500/50 hover:bg-brand-500/20"
                  >
                    <Globe className="h-4 w-4" />
                    Official Website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {technology.docsUrl && (
                  <a
                    href={technology.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
                  >
                    <BookMarked className="h-4 w-4" />
                    Documentation
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-brand-500/10 blur-2xl" />

                <div className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] border border-slate-700 bg-slate-900/90 shadow-2xl backdrop-blur-xl sm:h-52 sm:w-52">
                  <div className="absolute inset-3 rounded-[1.5rem] border border-brand-500/10" />

                  {technology.icon ? (
                    <img
                      src={technology.icon}
                      alt={`${technology.name} logo`}
                      className="relative h-24 w-24 object-contain sm:h-28 sm:w-28"
                    />
                  ) : (
                    <Layers className="relative h-20 w-20 text-brand-400" />
                  )}
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 shadow-xl backdrop-blur-sm">
                  Technology Profile
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Content */}
          <div className="space-y-10">
            {/* Overview */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                  <BookOpen className="h-5 w-5 text-slate-300" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">Overview</h2>
                  <p className="text-sm text-slate-500">
                    About this technology
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <p className="leading-8 text-slate-300">
                  {technology.description}
                </p>
              </div>
            </section>

            {/* Domains */}
            {domains.length > 0 && (
              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">Technology Domains</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Areas where this technology is used
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {domains.map((relation) => (
                    <button
                      key={relation.domainId}
                      onClick={() =>
                        navigate(
                          `/technology?domain=${encodeURIComponent(
                            relation.domainId
                          )}`
                        )
                      }
                      className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition hover:border-slate-600 hover:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-white">
                            {relation.domain.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {relation.domain.description}
                          </p>
                        </div>

                        <ArrowRight className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Sections */}
            {sections.length > 0 && (
              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">Related Sections</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Knowledge areas connected to this technology
                  </p>
                </div>

                <div className="space-y-3">
                  {sections.map((relation) => (
                    <button
                      key={relation.sectionId}
                      onClick={() =>
                        navigate(
                          `/technology?section=${encodeURIComponent(
                            relation.sectionId
                          )}`
                        )
                      }
                      className="group flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-left transition hover:border-slate-600 hover:bg-slate-900"
                    >
                      <div>
                        <h3 className="font-semibold text-white">
                          {relation.section.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {relation.section.content}
                        </p>
                      </div>

                      <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Related Technologies */}
            {relatedTechnologies.length > 0 && (
              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">
                    Related Technologies
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Other technologies connected to {technology.name}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedTechnologies.map((item) => (
                    <Link
                      key={item.id}
                      to={`/technology/${item.slug}`}
                      className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950">
                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt=""
                              className="h-7 w-7 object-contain"
                            />
                          ) : (
                            <Layers className="h-6 w-6 text-slate-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-white">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.category}
                          </p>
                        </div>

                        <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-white">
                  Technology Resources
                </h2>

                {technology.featured && (
                  <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400">
                    Featured
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {technology.websiteUrl && (
                  <a
                    href={technology.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
                  >
                    <span>Official Website</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {technology.docsUrl && (
                  <a
                    href={technology.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-600 hover:text-white"
                  >
                    <span>Documentation</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {!technology.websiteUrl && !technology.docsUrl && (
                  <p className="text-sm leading-6 text-slate-500">
                    No external resources have been added yet.
                  </p>
                )}
              </div>

              <div className="my-6 border-t border-slate-800" />

              <button
                onClick={() => navigate('/technology')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse All Technologies
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
