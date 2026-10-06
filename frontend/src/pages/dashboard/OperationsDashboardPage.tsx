import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Award, BookOpen, ClipboardCheck, FileText, FolderKanban, GraduationCap, ShieldAlert, Users } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  totalUsers: number; activeUsers: number; totalCourses: number; completedCourses: number;
  totalAssessments: number; totalCertificates: number; usersByRole: Record<string, number>;
  totalProjects: number; totalProducts: number; totalResearchProjects: number;
}
interface AuditLog { id: string; action: string; entity: string; createdAt: string; user?: { fullName?: string } }
interface Payload { stats: Stats; auditLogs: AuditLog[] }

export const OperationsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const superAdmin = user?.role === 'SUPER_ADMIN';
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { fetchApi<Payload>('/admin/stats').then(setPayload).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load platform operations.')); }, []);
  const s = payload?.stats;
  const cards = superAdmin ? [
    ['Total Users', s?.totalUsers, Users], ['Active Users', s?.activeUsers, Activity], ['Students', s?.usersByRole?.STUDENT, GraduationCap], ['Instructors', s?.usersByRole?.INSTRUCTOR, BookOpen],
    ['Researchers', s?.usersByRole?.RESEARCHER, BookOpen], ['Developers', s?.usersByRole?.DEVELOPER, FolderKanban], ['Partners', s?.usersByRole?.PARTNER, Users], ['Active Courses', s?.totalCourses, GraduationCap],
    ['Completed Courses', s?.completedCourses, BookOpen], ['Assessments', s?.totalAssessments, ClipboardCheck], ['Certificates Issued', s?.totalCertificates, Award], ['Pending Approvals', undefined, ShieldAlert],
  ] as const : [
    ['Platform Users', s?.totalUsers, Users], ['Active Users', s?.activeUsers, Activity], ['Courses', s?.totalCourses, GraduationCap], ['Assessments', s?.totalAssessments, ClipboardCheck],
    ['Community Reports', undefined, ShieldAlert], ['Research Projects', s?.totalResearchProjects, BookOpen], ['Projects', s?.totalProjects, FolderKanban], ['Certificates', s?.totalCertificates, Award],
  ] as const;
  const controlPath = superAdmin ? '/super-admin' : '/admin';
  return <div className="space-y-7">
    <header className={`rounded-3xl border p-6 sm:p-8 ${superAdmin ? 'border-amber-300/20 bg-gradient-to-br from-amber-950/60 to-slate-950' : 'border-sky-400/20 bg-gradient-to-br from-sky-950/60 to-slate-950'}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.22em] ${superAdmin ? 'text-amber-300' : 'text-sky-300'}`}>{superAdmin ? 'Platform oversight' : 'Platform operations'}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-black text-white">{superAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">{superAdmin ? 'Review platform-wide activity, security, learning, and escalated work.' : 'Monitor day-to-day users, content, community activity, and assigned work.'}</p></div><Link className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${superAdmin ? 'bg-amber-300 text-slate-950' : 'bg-sky-600 text-white'}`} to={controlPath}>Open Control Panel <ArrowRight size={16}/></Link></div>
    </header>
    {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><Icon className={`h-5 w-5 ${superAdmin ? 'text-amber-300' : 'text-sky-300'}`}/><p className="mt-4 text-2xl font-black text-white">{value ?? '—'}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p></article>)}</section>
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><div className="mb-4 flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-300"/><h2 className="font-bold text-white">{superAdmin ? 'Recent Administrative Activity' : 'Recent Platform Activity'}</h2></div>{payload?.auditLogs?.length ? <ul className="divide-y divide-slate-800">{payload.auditLogs.slice(0, 7).map((log) => <li key={log.id} className="flex items-center justify-between gap-4 py-3"><div><p className="text-sm font-semibold text-slate-200">{log.action} <span className="font-normal text-slate-400">· {log.entity}</span></p><p className="text-xs text-slate-500">{log.user?.fullName || 'System'}</p></div><time className="shrink-0 text-xs text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</time></li>)}</ul> : <p className="text-sm text-slate-500">{payload ? 'No administrative activity recorded.' : 'Loading platform activity…'}</p>}<Link className="mt-3 inline-flex items-center gap-2 text-sm text-blue-300" to={`${controlPath}/activity`}>Review audit activity <ArrowRight size={15}/></Link></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><div className="mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-violet-300"/><h2 className="font-bold text-white">Work and follow-up</h2></div><div className="grid gap-3 sm:grid-cols-2">{[[superAdmin ? 'Personal tasks' : 'Assigned tasks', '/dashboard/tasks'], ['Projects', '/dashboard/projects'], ['Reports and analytics', '/dashboard/analytics'], ['Community activity', '/dashboard/community']].map(([label, href]) => <Link key={label} className="rounded-xl border border-slate-800 p-4 text-sm font-semibold text-slate-200 hover:border-blue-400/40" to={href}>{label}<ArrowRight className="ml-2 inline h-4 w-4 text-slate-500"/></Link>)}</div><p className="mt-4 text-xs text-slate-500">{superAdmin ? 'Critical alerts, escalations, and approval queues are available through the Control Panel.' : 'Escalate critical issues to a Super Admin through the Control Panel.'}</p></div>
    </section>
  </div>;
};
