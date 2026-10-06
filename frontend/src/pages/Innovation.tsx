import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BrainCircuit,
  FlaskConical,
  Lightbulb,
  Plus,
  Rocket,
  Search,
  ThumbsUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
} from '../components/ui';

interface InnovationConcept {
  id: string;
  title: string;
  category: string;
  conceptStage: string;
  summary: string;
  fullDetails: string;
  votesCount: number;
  createdAt: string;
  author?: {
    fullName?: string;
    avatarUrl?: string | null;
    role?: string;
  };
}

const categories = [
  'All',
  'AI Agent',
  'Quantum',
  'Edge AI',
  'Autonomous Systems',
  'Robotics',
  'Distributed Systems',
  'Cryptography',
  'Other',
];

const stages = [
  'All',
  'Idea',
  'Research',
  'Prototype',
  'Testing',
  'Incubating',
  'Production',
  'Archived',
  'Rejected',
];

export const Innovation: React.FC = () => {
  const { user } = useAuth();

  const [concepts, setConcepts] = useState<InnovationConcept[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stage, setStage] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('AI Agent');
  const [summary, setSummary] = useState('');
  const [fullDetails, setFullDetails] = useState('');

  const loadConcepts = async () => {
    try {
      setLoading(true);
      const response = await fetchApi<{ concepts: InnovationConcept[] }>(
        '/innovation'
      );
      setConcepts(response.concepts || []);
    } catch (error) {
      console.error('Failed to load innovation concepts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConcepts();
  }, []);

  const filteredConcepts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return concepts.filter((concept) => {
      const matchesSearch =
        !query ||
        concept.title.toLowerCase().includes(query) ||
        concept.summary.toLowerCase().includes(query) ||
        concept.category.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All' || concept.category === category;

      const matchesStage =
        stage === 'All' || concept.conceptStage === stage;

      return matchesSearch && matchesCategory && matchesStage;
    });
  }, [concepts, search, category, stage]);

  const stats = useMemo(() => {
    const active = concepts.filter(
      (concept) =>
        !['Archived', 'Rejected'].includes(concept.conceptStage)
    ).length;

    const prototypes = concepts.filter(
      (concept) =>
        ['Prototype', 'Testing', 'Incubating', 'Production'].includes(
          concept.conceptStage
        )
    ).length;

    const votes = concepts.reduce(
      (total, concept) => total + (concept.votesCount || 0),
      0
    );

    const contributors = new Set(
      concepts.map((concept) => concept.author?.fullName).filter(Boolean)
    ).size;

    return {
      total: concepts.length,
      active,
      prototypes,
      votes,
      contributors,
    };
  }, [concepts]);

  const resetForm = () => {
    setTitle('');
    setSelectedCategory('AI Agent');
    setSummary('');
    setFullDetails('');
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !summary.trim() || !fullDetails.trim()) {
      return;
    }

    try {
      setSaving(true);

      await fetchApi('/innovation', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          category: selectedCategory,
          summary: summary.trim(),
          fullDetails: fullDetails.trim(),
        }),
      });

      resetForm();
      setShowModal(false);
      await loadConcepts();
    } catch (error) {
      console.error(error);
      alert('Failed to submit innovation concept.');
    } finally {
      setSaving(false);
    }
  };

  const handleVote = async (conceptId: string) => {
    if (!user) {
      alert('Please log in to vote on an innovation concept.');
      return;
    }

    try {
      await fetchApi(`/innovation/${conceptId}/vote`, {
        method: 'POST',
      });

      await loadConcepts();
    } catch (error: any) {
      console.error(error);

      const message =
        error?.message || 'Failed to register vote.';

      if (message.toLowerCase().includes('already voted')) {
        alert('You have already voted for this concept.');
        return;
      }

      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              CADELIBORA Innovation Lab
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
              Ideas become
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                intelligent systems.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-slate-400">
              Explore experimental concepts, emerging technologies, and
              community-driven ideas moving from early research toward
              real-world prototypes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user && (
                <Button
                  variant="primary"
                  onClick={() => setShowModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit an Idea
                </Button>
              )}

              <Link
                to="/research"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-900 transition-colors"
              >
                Explore Research
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Concepts', value: stats.total, Icon: Lightbulb },
            { label: 'Active', value: stats.active, Icon: Zap },
            { label: 'Prototype Track', value: stats.prototypes, Icon: FlaskConical },
            { label: 'Community Votes', value: stats.votes, Icon: ThumbsUp },
            { label: 'Contributors', value: stats.contributors, Icon: Users },
          ].map(({ label, value, Icon }) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-5"
            >
              <Icon className="w-5 h-5 text-cyan-400 mb-4" />
              <div className="text-2xl font-black text-white">
                {value}
              </div>
              <div className="mt-1 text-xs font-mono uppercase tracking-wider text-slate-500">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Innovation Pipeline
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black">
              Discover concepts
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Search and filter ideas across the innovation pipeline.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search concepts..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                  category === item
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <select
            value={stage}
            onChange={(event) => setStage(event.target.value)}
            className="lg:ml-auto px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300 focus:outline-none"
          >
            {stages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 rounded-3xl border border-slate-800 bg-slate-900 animate-pulse"
              />
            ))}
          </div>
        ) : filteredConcepts.length === 0 ? (
          <EmptyState
            title="No innovation concepts found"
            description="Try changing your search or filters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredConcepts.map((concept) => (
              <Card
                key={concept.id}
                className="group overflow-hidden border-slate-800 bg-slate-900/70 hover:border-cyan-500/30 transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-60" />

                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="cyan">{concept.category}</Badge>

                      <span className="text-[11px] font-mono uppercase text-slate-500">
                        {concept.conceptStage}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        <Link to={`/innovation/${concept.id}`}>
                          {concept.title}
                        </Link>
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-4">
                        {concept.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                      {concept.author?.avatarUrl ? (
                        <img
                          src={concept.author.avatarUrl}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                          <Users className="w-4 h-4 text-slate-500" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-300 truncate">
                          {concept.author?.fullName || 'CADELIBORA Contributor'}
                        </p>
                        <p className="text-[10px] text-slate-600 font-mono">
                          {concept.author?.role || 'Contributor'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleVote(concept.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">
                          {concept.votesCount}
                        </span>
                      </button>
                    </div>

                    <Link
                      to={`/innovation/${concept.id}`}
                      className="flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
                    >
                      Read concept
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Process */}
      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              From Idea to Impact
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black">
              The innovation pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                Icon: Lightbulb,
                number: '01',
                titleText: 'Idea',
                description: 'An initial hypothesis, concept, or unexplored possibility.',
              },
              {
                Icon: BrainCircuit,
                number: '02',
                titleText: 'Research',
                description: 'Technical investigation validates assumptions and possibilities.',
              },
              {
                Icon: FlaskConical,
                number: '03',
                titleText: 'Prototype',
                description: 'Promising concepts become experimental systems and prototypes.',
              },
              {
                Icon: Rocket,
                number: '04',
                titleText: 'Incubation',
                description: 'Validated concepts move toward practical deployment and impact.',
              },
            ].map(({ Icon, number, titleText, description }) => (
              <div
                key={String(number)}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <Icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-600">
                    {number}
                  </span>
                </div>

                <h3 className="font-bold text-white">
                  {titleText}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 p-8 sm:p-12">
          <Lightbulb className="w-10 h-10 mx-auto text-cyan-400" />

          <h2 className="mt-5 text-3xl sm:text-4xl font-black">
            Have an idea worth exploring?
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-400 leading-7">
            Contribute a concept to the CADELIBORA innovation pipeline and
            let the community explore where it could lead.
          </p>

          {user ? (
            <Button
              variant="primary"
              className="mt-7"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Innovation Concept
            </Button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
            >
              Sign in to contribute
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Submission modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Innovation Lab
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  Submit a concept
                </h3>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-2">
                  Concept Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Autonomous Research Assistant"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {categories
                    .filter((item) => item !== 'All')
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-2">
                  Summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Briefly explain the idea..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-2">
                  Full Details & Architecture
                </label>
                <textarea
                  required
                  rows={7}
                  value={fullDetails}
                  onChange={(event) => setFullDetails(event.target.value)}
                  placeholder="Describe the architecture, technical approach, research direction, or prototype..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-y"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Submitting...' : 'Submit Concept'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
