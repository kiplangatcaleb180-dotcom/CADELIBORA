import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  Award,
  Shield,
  Code,
  Cpu,
  GraduationCap,
  Briefcase,
  Sparkles,
  ExternalLink,
  Linkedin,
} from 'lucide-react';
import { fetchApi } from '../lib/api';

interface OrganizationLeader {
  id: string;
  name: string;
  position: string;
  department?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  expertiseJson?: string[] | string | null;
  sortOrder: number;
  isPublished: boolean;
}

interface OrganizationResponse {
  success: boolean;
  organization?: {
    leaders?: OrganizationLeader[];
  };
}

const parseArray = (value: string[] | string | null | undefined): string[] => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      return value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

export const PersonalIdentity: React.FC = () => {
  const [leaders, setLeaders] = useState<OrganizationLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadIdentity = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetchApi<OrganizationResponse>('/organization');

        if (!mounted) return;

        setLeaders(
          (response.organization?.leaders || [])
            .filter((leader) => leader.isPublished)
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
      } catch (err) {
        console.error('Failed to load personal identity:', err);

        if (mounted) {
          setError('Personal identity information is currently unavailable.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadIdentity();

    return () => {
      mounted = false;
    };
  }, []);

  const leader = useMemo(() => leaders[0] || null, [leaders]);

  const expertise = useMemo(
    () => parseArray(leader?.expertiseJson),
    [leader?.expertiseJson]
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center space-y-3">
            <Sparkles className="w-8 h-8 text-brand-400 mx-auto animate-pulse" />
            <p className="text-slate-400 font-mono text-sm">
              Loading personal identity...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center max-w-xl space-y-4">
            <Shield className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">
              Personal Identity Unavailable
            </h2>
            <p className="text-slate-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="text-center max-w-xl space-y-4">
            <User className="w-10 h-10 text-brand-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">
              Personal Identity Not Configured
            </h2>
            <p className="text-slate-400">
              No published leadership profile has been configured yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
          Personal Identity
        </h1>

        <h2 className="text-3xl sm:text-5xl font-black text-white">
          {leader.name}
        </h2>

        <p className="text-slate-300 text-sm sm:text-base">
          {leader.position}
          {leader.department ? ` · ${leader.department}` : ''}
        </p>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {leader.photoUrl ? (
            <img
              src={leader.photoUrl}
              alt={leader.name}
              className="w-32 h-32 rounded-2xl object-cover ring-2 ring-brand-500/50"
            />
          ) : (
            <div className="w-32 h-32 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <User className="w-12 h-12 text-slate-500" />
            </div>
          )}

          <div className="space-y-3 text-center sm:text-left">
            <span className="inline-flex px-3 py-1 bg-brand-500/10 text-brand-400 font-mono text-xs font-bold rounded-full">
              {leader.position}
            </span>

            <h3 className="text-2xl font-bold text-white">
              {leader.name}
            </h3>

            {leader.department && (
              <p className="text-xs font-mono text-slate-400">
                {leader.department}
              </p>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
              {leader.websiteUrl && (
                <a
                  href={leader.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}

              {leader.linkedinUrl && (
                <a
                  href={leader.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {leader.bio && (
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-mono bg-slate-950 p-6 rounded-2xl border border-slate-800">
            {leader.bio
              .split(/\n+/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={`${leader.id}-bio-${index}`}>{paragraph}</p>
              ))}
          </div>
        )}

        {expertise.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-bold text-white">
                Areas of Expertise
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {expertise.map((item, index) => (
                <div
                  key={`${leader.id}-expertise-${index}`}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Code className="w-4 h-4 text-brand-400" />
                    <span className="text-sm text-slate-300">
                      {item}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Award className="w-5 h-5 text-brand-400 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-mono">
              Leadership
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Shield className="w-5 h-5 text-brand-400 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-mono">
              Governance
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <Code className="w-5 h-5 text-brand-400 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-mono">
              Technology
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <GraduationCap className="w-5 h-5 text-brand-400 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-mono">
              Expertise
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
