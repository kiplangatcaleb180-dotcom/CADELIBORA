import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Rocket,
  ThumbsUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { fetchApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Badge, Button, Card, CardContent } from '../components/ui';

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

const stageOrder = [
  'Idea',
  'Research',
  'Prototype',
  'Testing',
  'Incubating',
  'Production',
];

const stageIcons: Record<string, React.ElementType> = {
  Idea: Lightbulb,
  Research: Zap,
  Prototype: FlaskConical,
  Testing: CheckCircle2,
  Incubating: Rocket,
  Production: Rocket,
};

export const InnovationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [concept, setConcept] = useState<InnovationConcept | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const loadConcept = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await fetchApi<{ concept: InnovationConcept }>(
        `/innovation/${id}`
      );

      setConcept(response.concept);
    } catch (error) {
      console.error('Failed to load innovation concept:', error);
      setConcept(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConcept();
  }, [id]);

  const handleVote = async () => {
    if (!concept || voting) return;

    if (!user) {
      alert('Please log in to vote on this innovation concept.');
      return;
    }

    try {
      setVoting(true);

      await fetchApi(`/innovation/${concept.id}/vote`, {
        method: 'POST',
      });

      await loadConcept();
    } catch (error) {
      console.error(error);
      alert('Failed to register vote.');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-5 w-32 rounded bg-slate-900 animate-pulse" />
          <div className="h-16 w-3/4 rounded bg-slate-900 animate-pulse" />
          <div className="h-32 rounded-3xl bg-slate-900 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 rounded-3xl bg-slate-900 animate-pulse" />
            <div className="h-72 rounded-3xl bg-slate-900 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <Lightbulb className="w-12 h-12 mx-auto text-slate-700" />
          <h1 className="mt-5 text-2xl font-bold text-white">
            Innovation concept not found
          </h1>
          <p className="mt-2 text-slate-500">
            The concept may have been removed or is no longer available.
          </p>

          <Button
            variant="outline"
            className="mt-6"
            onClick={() => navigate('/innovation')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Innovation
          </Button>
        </div>
      </div>
    );
  }

  const currentStageIndex = stageOrder.indexOf(concept.conceptStage);
  const StageIcon = stageIcons[concept.conceptStage] || Lightbulb;

  const createdDate = new Date(concept.createdAt).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_35%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <button
            onClick={() => navigate('/innovation')}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Innovation Center
          </button>

          <div className="mt-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="cyan">{concept.category}</Badge>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono text-slate-400">
                <StageIcon className="w-3.5 h-3.5 text-cyan-400" />
                {concept.conceptStage}
              </span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              {concept.title}
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400 max-w-3xl">
              {concept.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {createdDate}
              </span>

              <span className="inline-flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                {concept.votesCount} community votes
              </span>

              <span className="inline-flex items-center gap-2">
                <Users className="w-4 h-4" />
                Community concept
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10">
                    <Lightbulb className="w-5 h-5 text-cyan-400" />
                  </div>

                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                      Concept Overview
                    </p>
                    <h2 className="text-2xl font-bold">
                      The idea
                    </h2>
                  </div>
                </div>

                <p className="text-slate-300 leading-8">
                  {concept.summary}
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10">
                    <FlaskConical className="w-5 h-5 text-indigo-400" />
                  </div>

                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                      Technical Direction
                    </p>
                    <h2 className="text-2xl font-bold">
                      Architecture & details
                    </h2>
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-slate-300 leading-8">
                  {concept.fullDetails}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline */}
            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Innovation Pipeline
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Concept maturity
                </h2>

                <div className="mt-8 space-y-5">
                  {stageOrder.map((stageName, index) => {
                    const Icon = stageIcons[stageName] || Lightbulb;
                    const isCurrent = stageName === concept.conceptStage;
                    const isComplete =
                      currentStageIndex >= 0 &&
                      index < currentStageIndex;

                    return (
                      <div
                        key={stageName}
                        className={`flex items-center gap-4 ${
                          isCurrent
                            ? 'text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${
                            isCurrent
                              ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                              : isComplete
                              ? 'border-slate-700 bg-slate-900 text-slate-400'
                              : 'border-slate-800 bg-slate-950'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <span
                              className={`text-sm font-semibold ${
                                isCurrent
                                  ? 'text-cyan-300'
                                  : isComplete
                                  ? 'text-slate-300'
                                  : 'text-slate-600'
                              }`}
                            >
                              {stageName}
                            </span>

                            {isCurrent && (
                              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                                Current stage
                              </span>
                            )}
                          </div>

                          <div className="mt-2 h-px bg-slate-800">
                            <div
                              className={`h-px ${
                                isCurrent || isComplete
                                  ? 'bg-cyan-500/50'
                                  : 'bg-transparent'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/70 lg:sticky lg:top-24">
              <CardContent className="p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Community Signal
                </p>

                <div className="mt-5 flex items-end gap-3">
                  <span className="text-5xl font-black text-white">
                    {concept.votesCount}
                  </span>

                  <span className="pb-1 text-sm text-slate-500">
                    votes
                  </span>
                </div>

                <button
                  onClick={handleVote}
                  disabled={voting}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold hover:bg-cyan-500/20 disabled:opacity-50 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {voting ? 'Registering...' : 'Support this concept'}
                </button>

                {!user && (
                  <p className="mt-3 text-xs text-slate-600 text-center">
                    Sign in to participate in community voting.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70">
              <CardContent className="p-6">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Contributor
                </p>

                <div className="mt-5 flex items-center gap-4">
                  {concept.author?.avatarUrl ? (
                    <img
                      src={concept.author.avatarUrl}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">
                      {concept.author?.fullName ||
                        'CADELIBORA Contributor'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {concept.author?.role || 'Contributor'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                Continue exploring
              </p>

              <Link
                to="/innovation"
                className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
              >
                More innovation concepts
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/research"
                className="mt-4 flex items-center justify-between text-sm font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
              >
                Research Institute
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
