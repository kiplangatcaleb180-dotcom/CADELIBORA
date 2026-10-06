import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import {
  Shield,
  Globe,
  Users,
  Milestone,
  Layers,
  Building2,
  UserCheck,
  Calendar,
} from 'lucide-react';

interface OrganizationHistory {
  id: string;
  year: number;
  title: string;
  description: string;
  sortOrder: number;
}

interface OrganizationMilestone {
  id: string;
  year: number;
  title: string;
  description: string;
  icon?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

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
  expertiseJson: string[];
  sortOrder: number;
  isPublished: boolean;
}

interface OrganizationDepartment {
  id: string;
  name: string;
  slug: string;
  description: string;
  purpose?: string | null;
  icon?: string | null;
  coverImage?: string | null;
  responsibilitiesJson: string[];
  sortOrder: number;
  isActive: boolean;
}

interface OrganizationUnit {
  id: string;
  parentId?: string | null;
  name: string;
  title?: string | null;
  description?: string | null;
  leaderName?: string | null;
  level: number;
  sortOrder: number;
}

interface OrganizationPartner {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface OrganizationSection {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

interface OrganizationData {
  id: string;
  name: string;
  tagline?: string | null;
  description: string;
  vision?: string | null;
  mission?: string | null;
  valuesJson: string[];
  logoUrl?: string | null;
  websiteUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isPublished: boolean;
  history: OrganizationHistory[];
  milestones: OrganizationMilestone[];
  leaders: OrganizationLeader[];
  departments: OrganizationDepartment[];
  units: OrganizationUnit[];
  partners: OrganizationPartner[];
  sections: OrganizationSection[];
}

export const Organization: React.FC = () => {
  const [tab, setTab] = useState<
    'about' | 'leadership' | 'milestones' | 'departments' | 'hierarchy'
  >('about');

  const [organization, setOrganization] =
    useState<OrganizationData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchApi<{
          success: boolean;
          organization?: OrganizationData;
          message?: string;
        }>('/organization');

        if (!data.success || !data.organization) {
          throw new Error(
            data.message || 'Organization information is unavailable.'
          );
        }

        setOrganization(data.organization);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load organization information.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrganization();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded mx-auto" />
          <div className="h-10 w-72 bg-slate-800 rounded mx-auto" />
          <div className="h-4 w-full max-w-2xl bg-slate-800 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800">
          <h2 className="text-xl font-bold text-white">
            Organization information unavailable
          </h2>

          <p className="mt-3 text-slate-400">
            {error || 'No organization information has been configured yet.'}
          </p>
        </div>
      </div>
    );
  }

  const renderOrganizationUnit = (
    unit: OrganizationUnit,
    allUnits: OrganizationUnit[],
    depth = 0
  ): React.ReactNode => {
    const children = allUnits
      .filter((child) => child.parentId === unit.id)
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder ||
          a.name.localeCompare(b.name)
      );

    return (
      <div key={unit.id} className="space-y-3">
        <div
          className="p-5 rounded-2xl bg-slate-950 border border-slate-800"
          style={{
            marginLeft: `${Math.min(depth, 5) * 24}px`,
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-400" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  {unit.name}
                </h4>

                <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                  Level {unit.level}
                </span>
              </div>

              {unit.title && (
                <p className="text-xs text-brand-400 mt-1">
                  {unit.title}
                </p>
              )}

              {unit.leaderName && (
                <p className="text-xs text-slate-500 mt-1">
                  Lead: {unit.leaderName}
                </p>
              )}

              {unit.description && (
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {unit.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {children.map((child) =>
          renderOrganizationUnit(child, allUnits, depth + 1)
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400">
          About {organization.name}
        </h1>

        <h2 className="text-3xl sm:text-5xl font-black text-white">
          Organization & Global Governance
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {organization.description}
        </p>

        {organization.tagline && (
          <p className="text-sm text-brand-400 font-mono">
            {organization.tagline}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-2 font-mono text-xs">
        {[
          { id: 'about', label: 'Vision & Mission' },
          { id: 'leadership', label: 'Founder & Leadership' },
          { id: 'milestones', label: 'Milestones & History' },
          { id: 'departments', label: 'Departments & Partners' },
          { id: 'hierarchy', label: 'Org Chart' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as typeof tab)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              tab === item.id
                ? 'bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800">
        {/* ABOUT */}
        {tab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Globe className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Our Vision
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {organization.vision ||
                  'Our vision has not yet been published.'}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyber-accent/10 border border-cyber-accent/30 flex items-center justify-center text-cyber-accent">
                <Shield className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Our Mission
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {organization.mission ||
                  'Our mission has not yet been published.'}
              </p>
            </div>
          </div>
        )}

        {/* LEADERSHIP */}
        {tab === 'leadership' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white text-center">
              Executive Leadership & Founder
            </h3>

            {organization.leaders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {organization.leaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4"
                  >
                    {leader.photoUrl ? (
                      <img
                        src={leader.photoUrl}
                        alt={leader.name}
                        className="w-24 h-24 rounded-2xl mx-auto object-cover ring-2 ring-brand-500/40"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl mx-auto bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <UserCheck className="w-10 h-10 text-slate-500" />
                      </div>
                    )}

                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {leader.name}
                      </h4>

                      <p className="text-xs font-mono text-brand-400 font-semibold">
                        {leader.position}
                      </p>

                      {leader.department && (
                        <p className="text-xs text-slate-500 mt-1">
                          {leader.department}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {leader.bio ||
                        'No biography has been published yet.'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-10 h-10 mx-auto text-slate-600 mb-4" />

                <h4 className="text-lg font-bold text-white">
                  No leadership profiles published yet
                </h4>

                <p className="text-sm text-slate-400 mt-2">
                  Leadership profiles have not yet been published.
                </p>
              </div>
            )}
          </div>
        )}

        {/* MILESTONES & HISTORY */}
        {tab === 'milestones' && (
          <div className="space-y-10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white text-center">
              Milestones & History
            </h3>

            {organization.history.length === 0 &&
            organization.milestones.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-10 h-10 mx-auto text-slate-600 mb-4" />

                <h4 className="text-lg font-bold text-white">
                  No history or milestones published yet
                </h4>

                <p className="text-sm text-slate-400 mt-2">
                  Historical information and organizational milestones
                  have not yet been published.
                </p>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                {[
                  ...organization.history.map((item) => ({
                    id: `history-${item.id}`,
                    year: item.year,
                    title: item.title,
                    description: item.description,
                    type: 'History',
                  })),
                  ...organization.milestones.map((item) => ({
                    id: `milestone-${item.id}`,
                    year: item.year,
                    title: item.title,
                    description: item.description,
                    type: 'Milestone',
                  })),
                ]
                  .sort((a, b) => a.year - b.year)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4"
                    >
                      <span className="px-3 py-1 rounded bg-brand-500/20 text-brand-400 font-bold whitespace-nowrap">
                        {item.year}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">
                            {item.title}
                          </h4>

                          <span className="text-[10px] uppercase tracking-wider text-slate-500">
                            {item.type}
                          </span>
                        </div>

                        <p className="text-slate-400 pt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* DEPARTMENTS & PARTNERS */}
        {tab === 'departments' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white text-center">
              Core Operating Departments
            </h3>

            {organization.departments.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-4" />

                <h4 className="text-lg font-bold text-white">
                  No departments published yet
                </h4>

                <p className="text-sm text-slate-400 mt-2">
                  Department information has not yet been published.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                {organization.departments.map((department) => (
                  <div
                    key={department.id}
                    className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-brand-400" />
                      </div>

                      <h4 className="text-brand-400 font-bold text-sm">
                        {department.name}
                      </h4>
                    </div>

                    <p className="text-slate-300 leading-relaxed">
                      {department.description}
                    </p>

                    {department.purpose && (
                      <div>
                        <span className="text-slate-500 uppercase tracking-wider">
                          Purpose
                        </span>

                        <p className="text-slate-400 mt-1">
                          {department.purpose}
                        </p>
                      </div>
                    )}

                    {department.responsibilitiesJson.length > 0 && (
                      <div>
                        <span className="text-slate-500 uppercase tracking-wider">
                          Responsibilities
                        </span>

                        <ul className="mt-2 space-y-1 text-slate-400">
                          {department.responsibilitiesJson.map(
                            (responsibility, index) => (
                              <li key={index}>
                                • {responsibility}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-8 border-t border-slate-800">
              <h3 className="text-xl font-bold text-white text-center">
                Partners
              </h3>

              {organization.partners.length === 0 ? (
                <p className="text-sm text-slate-400 text-center mt-4">
                  Partner information has not yet been published.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {organization.partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-6 bg-slate-950 rounded-2xl border border-slate-800"
                    >
                      <h4 className="text-sm font-bold text-white">
                        {partner.name}
                      </h4>

                      <p className="text-xs text-brand-400 mt-1">
                        {partner.type}
                      </p>

                      {partner.description && (
                        <p className="text-sm text-slate-400 mt-3">
                          {partner.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORGANIZATION STRUCTURE */}
        {tab === 'hierarchy' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white text-center">
              CADELIBORA Organization Structure
            </h3>

            {organization.units.length === 0 ? (
              <div className="text-center py-12">
                <Milestone className="w-10 h-10 mx-auto text-slate-600 mb-4" />

                <h4 className="text-lg font-bold text-white">
                  No organization structure published yet
                </h4>

                <p className="text-sm text-slate-400 mt-2">
                  The organizational structure has not yet been
                  published.
                </p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-4">
                {organization.units
                  .filter((unit) => !unit.parentId)
                  .sort(
                    (a, b) =>
                      a.sortOrder - b.sortOrder ||
                      a.name.localeCompare(b.name)
                  )
                  .map((unit) =>
                    renderOrganizationUnit(unit, organization.units)
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};