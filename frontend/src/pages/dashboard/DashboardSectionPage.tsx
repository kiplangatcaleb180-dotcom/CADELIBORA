import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Compass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardRoleConfig } from '../../config/dashboardRoles';
import { DashboardAnalyticsPage } from './DashboardAnalyticsPage';
import { DashboardAssignmentsPage } from './DashboardAssignmentsPage';
import { DashboardCoursesPage } from './DashboardCoursesPage';
import { DashboardLibraryPage } from './DashboardLibraryPage';
import { DashboardProjectsPage } from './DashboardProjectsPage';
import { DashboardResearchPage } from './DashboardResearchPage';
import { ModeratorDashboardPage } from './ModeratorDashboardPage';

const sectionLinks: Record<string, { description: string; links: { label: string; to: string; description: string }[] }> = {
  'my-work': { description: 'Your current work and assigned responsibilities.', links: [{ label: 'Open projects', to: '/dashboard/projects', description: 'Review your project workspace.' }, { label: 'Open tasks', to: '/dashboard/tasks', description: 'Review assignments and work items.' }] },
  tasks: { description: 'Tasks and assignments connected to your role.', links: [{ label: 'Open assignments', to: '/dashboard/assignments', description: 'View, submit, or grade course assignments.' }, { label: 'View projects', to: '/dashboard/projects', description: 'Continue project work.' }] },
  reports: { description: 'Performance and activity reporting for your workspace.', links: [{ label: 'Open analytics', to: '/dashboard/analytics', description: 'View available workspace metrics.' }] },
  lessons: { description: 'Course lessons and learning materials.', links: [{ label: 'Open courses', to: '/dashboard/courses', description: 'Review courses and course content.' }, { label: 'Browse Academy', to: '/academy', description: 'Explore published learning materials.' }] },
  students: { description: 'Learners and submissions connected to your teaching courses.', links: [{ label: 'Review assignments', to: '/dashboard/assignments', description: 'See student submissions and grading work.' }, { label: 'Open courses', to: '/dashboard/courses', description: 'Review your course workspace.' }] },
  assessments: { description: 'Course assessments, submissions, and grading.', links: [{ label: 'Open assignments', to: '/dashboard/assignments', description: 'Submit or grade assessments.' }, { label: 'View certificates', to: '/dashboard/certificates', description: 'Review completed learning credentials.' }] },
  moderation: { description: 'Community moderation workspace and member activity.', links: [{ label: 'Open community', to: '/community', description: 'Review current community discussions.' }, { label: 'Review reports', to: '/dashboard/reports', description: 'Open available activity reports.' }] },
  'flagged-content': { description: 'Review content that needs moderator attention.', links: [{ label: 'Open community', to: '/community', description: 'Review discussions and posts.' }, { label: 'Open moderation', to: '/dashboard/moderation', description: 'Return to moderation tools.' }] },
  users: { description: 'Community members and user activity.', links: [{ label: 'Open community', to: '/community', description: 'Browse member posts and discussions.' }, { label: 'Open messages', to: '/dashboard/messages', description: 'Contact your collaborators.' }] },
  community: { description: 'Community discussions and collaboration.', links: [{ label: 'Visit community', to: '/community', description: 'Browse and join community discussions.' }] },
  research: { description: 'Your research initiatives, experiments, and publications.', links: [{ label: 'Open research workspace', to: '/dashboard/research', description: 'Review research saved to your workspace.' }, { label: 'Browse publications', to: '/publications', description: 'Explore platform publications.' }] },
  experiments: { description: 'Research and development experiments.', links: [{ label: 'Open research', to: '/dashboard/research', description: 'Review your research initiatives.' }, { label: 'Open projects', to: '/dashboard/projects', description: 'Review project work.' }] },
  publications: { description: 'Research publications and scholarly outputs.', links: [{ label: 'Browse publications', to: '/publications', description: 'Explore published work.' }, { label: 'Open research', to: '/dashboard/research', description: 'Review your research workspace.' }] },
  collaborators: { description: 'People and teams connected to your work.', links: [{ label: 'Open projects', to: '/dashboard/projects', description: 'Review project teams and work.' }, { label: 'Open messages', to: '/dashboard/messages', description: 'Contact collaborators.' }] },
  'developer-center': { description: 'Developer tools, platform resources, and project work.', links: [{ label: 'Open Developer Center', to: '/developers', description: 'Browse developer resources.' }, { label: 'Open projects', to: '/dashboard/projects', description: 'Review your projects.' }] },
  documentation: { description: 'Platform and developer documentation.', links: [{ label: 'Browse documentation', to: '/docs', description: 'Read platform documentation.' }, { label: 'Developer Center', to: '/developers', description: 'Explore SDKs and developer resources.' }] },
  apis: { description: 'API references and integration resources.', links: [{ label: 'Browse documentation', to: '/docs', description: 'Open API and platform documentation.' }, { label: 'Developer Center', to: '/developers', description: 'Explore developer tools and SDKs.' }] },
  tools: { description: 'Developer and research tools available on the platform.', links: [{ label: 'Open AI workspace', to: '/ai', description: 'Explore AI models and tools.' }, { label: 'Open Developer Center', to: '/developers', description: 'Browse integration resources.' }] },
  partnerships: { description: 'Partner relationships and shared work.', links: [{ label: 'Browse services', to: '/services', description: 'Review partnership and service opportunities.' }, { label: 'Open projects', to: '/dashboard/projects', description: 'Review collaborative project work.' }] },
  programs: { description: 'Programs and initiatives available to partners.', links: [{ label: 'Browse programs', to: '/research', description: 'Explore platform programs and initiatives.' }, { label: 'Browse services', to: '/services', description: 'Review services and partnership opportunities.' }] },
  resources: { description: 'Shared resources and partner materials.', links: [{ label: 'Open library', to: '/dashboard/library', description: 'Review saved resources.' }, { label: 'Browse library', to: '/library', description: 'Explore platform resources.' }] },
};

export const DashboardSectionPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const config = getDashboardRoleConfig(user?.role);
  const item = config.navItems.find((navItem) => navItem.path === location.pathname);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const slug = pathParts[pathParts.length - 1] || '';
  if (user?.role === 'MODERATOR' && ['moderation', 'reports', 'flagged-content', 'users'].includes(slug)) return <ModeratorDashboardPage />;
  if (slug === 'my-work') return <DashboardProjectsPage />;
  if (slug === 'tasks' || slug === 'assessments' || slug === 'students') return <DashboardAssignmentsPage />;
  if (slug === 'reports') return <DashboardAnalyticsPage />;
  if (slug === 'lessons') return <DashboardCoursesPage />;
  if (slug === 'experiments' || slug === 'research') return <DashboardResearchPage />;
  if (slug === 'resources') return <DashboardLibraryPage />;
  const section = sectionLinks[slug] || { description: 'Open related platform tools for this workspace section.', links: [{ label: 'Open dashboard', to: '/dashboard', description: 'Return to your role dashboard.' }] };
  const Icon = item?.icon || Compass;

  return <div className="max-w-4xl space-y-6">
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
      <div className="flex items-center gap-3 text-brand-300"><Icon className="h-6 w-6" /><span className="text-xs font-bold uppercase tracking-[0.18em]">{config.label}</span></div>
      <h1 className="mt-4 text-3xl font-black text-white">{item?.label || 'Workspace'}</h1>
      <p className="mt-2 text-sm text-slate-400">{section.description}</p>
    </section>
    <section className="grid gap-4 sm:grid-cols-2">
      {section.links.map((link) => <Link key={link.to} to={link.to} className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-5 hover:border-brand-500/50">
        <div className="flex items-center justify-between"><h2 className="font-bold text-white group-hover:text-brand-300">{link.label}</h2><ArrowUpRight className="h-4 w-4 text-brand-400" /></div>
        <p className="mt-2 text-xs leading-5 text-slate-400">{link.description}</p>
      </Link>)}
    </section>
  </div>;
};

export default DashboardSectionPage;
