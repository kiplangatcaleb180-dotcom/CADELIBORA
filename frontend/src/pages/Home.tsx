import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Shield, Sparkles, GraduationCap, ArrowRight, Layers, Globe, Code, Zap, Award, BookOpen, Users, Terminal, CheckCircle2, Server, Rocket } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ai' | 'research' | 'academy' | 'security'>('ai');
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    research: 0,
    projects: 0,
    library: 0,
    community: 0,
    articles: 0,
  });
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [featuredResearch, setFeaturedResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [statsRes, coursesRes, researchRes, projectsRes, libraryRes, communityRes, articlesRes] = await Promise.all([
          fetchApi<{ success: boolean; stats: any }>('/stats/public').catch(() => ({ success: false, stats: null })),
          fetchApi<{ courses: any[] }>('/courses').catch(() => ({ courses: [] })),
          fetchApi<{ projects: any[] }>('/research/projects').catch(() => ({ projects: [] })),
          fetchApi<{ projects: any[]; products: any[] }>('/projects').catch(() => ({ projects: [], products: [] })),
          fetchApi<{ resources: any[] }>('/library').catch(() => ({ resources: [] })),
          fetchApi<{ posts: any[] }>('/community/posts').catch(() => ({ posts: [] })),
          fetchApi<{ articles: any[] }>('/articles').catch(() => ({ articles: [] })),
        ]);

        setStats({
          users: statsRes.stats?.totalUsers || 0,
          courses: statsRes.stats?.totalCourses || coursesRes.courses?.length || 0,
          research: statsRes.stats?.totalResearchProjects || researchRes.projects?.length || 0,
          projects: (projectsRes.projects?.length || 0) + (projectsRes.products?.length || 0),
          library: statsRes.stats?.totalLibraryResources || libraryRes.resources?.length || 0,
          community: statsRes.stats?.totalCommunityPosts || communityRes.posts?.length || 0,
          articles: statsRes.stats?.totalArticles || articlesRes.articles?.length || 0,
        });

        setFeaturedCourses(coursesRes.courses?.slice(0, 3) || []);
        setFeaturedResearch(researchRes.projects?.slice(0, 2) || []);
      } catch (err) {
        console.error('Failed to load landing page data', err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  return (
    <div className="space-y-28 pb-24 overflow-x-hidden">
      {/* Dynamic Animated Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/15 blur-[160px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyber-accent/15 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div
            className="home-hero-enter home-hero-enter-0 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/90 border border-brand-500/40 text-brand-400 text-xs font-mono font-bold shadow-lg shadow-brand-500/10"
          >
            <Sparkles className="w-4 h-4 text-cyber-neon animate-pulse" />
            <span>CADELIBORA Global Innovation Platform & Research Institute</span>
          </div>

          <h1
            className="home-hero-enter home-hero-enter-1 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight"
          >
            Architecting the Future of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-cyber-accent to-cyber-neon">
              Autonomous AI & Quantum Tech
            </span>
          </h1>

          <p
            className="home-hero-enter home-hero-enter-2 text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            A unified ecosystem combining fundamental computer science research, an enterprise AI lab, digital academy, zero-trust cloud infrastructure, and open-source developer platform.
          </p>

          <div
            className="home-hero-enter home-hero-enter-3 flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/ai"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyber-accent hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <Cpu className="w-5 h-5" />
              <span>Launch AI Studio & Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/academy"
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-brand-500/50 text-slate-100 font-bold text-sm flex items-center gap-3 glass-panel transition-all hover:bg-slate-800"
            >
              <GraduationCap className="w-5 h-5 text-brand-400" />
              <span>Explore CADELIBORA Academy</span>
            </Link>
          </div>

          {/* Key Metrics Row (Wired to Live DB Stats) */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { label: 'Published Courses', value: stats.courses, icon: BookOpen, color: 'text-brand-400' },
              { label: 'Research Initiatives', value: stats.research, icon: Sparkles, color: 'text-cyber-accent' },
              { label: 'Registered Platform Users', value: stats.users, icon: Users, color: 'text-cyber-neon' },
              { label: 'Library Resources & Posts', value: stats.library + stats.community, icon: Layers, color: 'text-purple-400' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl glass-panel glass-panel-hover border border-slate-800 text-center space-y-2">
                  <Icon className={`w-6 h-6 mx-auto ${stat.color}`} />
                  <div className="text-3xl font-black font-mono text-white">
                    {loading ? '...' : stat.value}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Pillar Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyber-accent">Complete Ecosystem</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Integrated Pillars of CADELIBORA</h3>
        </div>

        {/* Pillar Switcher Buttons */}
        <div className="flex justify-center gap-3 overflow-x-auto pb-2 font-mono text-xs">
          {[
            { id: 'ai', label: '1. AI Ecosystem', icon: Cpu },
            { id: 'research', label: '2. Research Institute', icon: Sparkles },
            { id: 'academy', label: '3. Digital Academy', icon: GraduationCap },
            { id: 'security', label: '4. Cybersecurity & Tech', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Banner */}
        <div className="p-10 rounded-3xl glass-panel border border-slate-800 bg-slate-900/60">
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-brand-500/10 text-brand-400 font-mono text-xs font-bold rounded-full">CADELIBORA AI ENGINE</span>
                <h4 className="text-2xl font-bold text-white">ANR-X Autonomous Reasoning Framework</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our flagship neuro-symbolic language engine combines formal mathematical deduction, self-correcting logic loops, private RAG vector search, and strict security guardrails.
                </p>
                <div className="space-y-2 pt-2">
                  {['Private vector storage & RAG pipeline', 'Neuro-symbolic proof generation', 'Plug-and-play API hooks for custom LLMs'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/ai" className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 pt-2 hover:underline">
                  <span>Open Interactive AI Laboratory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span>ANR-X-STATUS.log</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <p className="text-brand-400">&gt; query: "Benchmarking zero-shot reasoning throughput"</p>
                <p className="text-slate-300 pl-4">&gt; Throughput: 142 tokens/sec | Precision: FP16 | Guardrails: Pass</p>
                <p className="text-cyber-accent pl-4">&gt; Response verified against CADELIBORA formal logic specs.</p>
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 font-mono text-xs font-bold rounded-full">RESEARCH INSTITUTE</span>
                <h4 className="text-2xl font-bold text-white">Neuro-Symbolic AI & Quantum Resilience</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  CADELIBORA scientists publish open research papers on lattice-based cryptography, formal software verification, and high-density distributed systems.
                </p>
                <Link to="/research" className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 pt-2 hover:underline">
                  <span>View Publications & DOI Archive</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {featuredResearch.length > 0 ? (
                  featuredResearch.map((res: any) => (
                    <div key={res.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <p className="text-white font-bold">{res.title}</p>
                      <p className="text-slate-400">{res.area} • {res.status}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-center">
                    Loading research initiatives...
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'academy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold rounded-full">DIGITAL ACADEMY</span>
                <h4 className="text-2xl font-bold text-white">Peer-Reviewed Fellowship & Courses</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Study structured curriculums, complete hands-on engineering assessments, and earn verifiable digital certificates.
                </p>
                <Link to="/academy" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 pt-2 hover:underline">
                  <span>Browse Course Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {featuredCourses.length > 0 ? (
                  featuredCourses.map((c: any) => (
                    <div key={c.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <p className="text-white font-bold">{c.title}</p>
                      <p className="text-slate-400">{c.category} • {c.level}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-center">
                    Loading academy courses...
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 font-mono text-xs font-bold rounded-full">CYBERSECURITY</span>
                <h4 className="text-2xl font-bold text-white">Zero-Trust Identity & Cloud Shield</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Protect enterprise workloads with ephemeral mTLS workload identity, automated threat hunting, and post-quantum encryption.
                </p>
                <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 pt-2 hover:underline">
                  <span>Explore Consulting Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Workload Identity SPIFFE</span>
                  <span className="text-emerald-400">VERIFIED</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>mTLS Encryption</span>
                  <span className="text-emerald-400">AES-256-GCM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Real-Time Anomaly Auditor</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid of All 16 Ecosystem Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">Navigation Hub</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Explore CADELIBORA Modules</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Organization', path: '/organization', desc: 'Vision, Mission, Leadership & Hierarchy', icon: Globe },
            { title: 'Technology Center', path: '/technology', desc: 'Micro-kernels, Cloud & Data Science', icon: Server },
            { title: 'Research Institute', path: '/research', desc: 'Active Projects, Papers & DOI Index', icon: Sparkles },
            { title: 'AI Ecosystem', path: '/ai', desc: 'ANR-X Model, AI Studio & Chat Lab', icon: Cpu },
            { title: 'Innovation Lab', path: '/innovation', desc: 'Prototypes, Concept Voting & Ideas', icon: Zap },
            { title: 'Products Showcase', path: '/products', desc: 'SaaS Platforms & Enterprise Tools', icon: Rocket },
            { title: 'Software Projects', path: '/projects', desc: 'Open Source Repositories & Tech Stack', icon: Code },
            { title: 'Digital Academy', path: '/academy', desc: 'Courses, Quizzes & Certificates', icon: GraduationCap },
            { title: 'Knowledge Base', path: '/library', desc: 'E-Books, Specs & Whitepapers', icon: BookOpen },
            { title: 'Developer Center', path: '/developers', desc: 'API Endpoints & TypeScript SDK', icon: Terminal },
            { title: 'Community Forum', path: '/community', desc: 'Discussions, Posts & Specialist Groups', icon: Users },
            { title: 'Services & Consulting', path: '/services', desc: 'Enterprise AI & Security Solutions', icon: Shield },
            { title: 'Case Studies', path: '/case-studies', desc: 'Real Client Outcomes & System Metrics', icon: Award },
            { title: 'Newsroom & Media', path: '/news', desc: 'Announcements, Press Releases & Events', icon: Layers },
            { title: 'Personal Portal', path: '/dashboard', desc: 'Student Dashboard, Progress & Profile', icon: Users },
            ...(user && ['ADMIN', 'SUPER_ADMIN'].includes(user.role) ? [{ title: user.role === 'SUPER_ADMIN' ? 'Super Admin Console' : 'Admin Workspace', path: user.role === 'SUPER_ADMIN' ? '/super-admin' : '/admin', desc: user.role === 'SUPER_ADMIN' ? 'Global authority, identity management & platform oversight' : 'Manage assigned platform operations', icon: Shield }] : []),
          ].map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Link
                key={i}
                to={mod.path}
                className="p-6 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors">{mod.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
