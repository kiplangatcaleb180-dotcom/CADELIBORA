import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowUpRight, BookOpen, Boxes, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export const SuperAdminDashboardView: React.FC = () => {
  const [payload, setPayload] = useState<any>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchApi<{ stats: any; auditLogs: any[] }>('/admin/stats').then(setPayload).catch((err: any) => setError(err.message || 'Could not load platform overview'));
  }, []);

  const stats = payload?.stats;
  const cards = [
    { label: 'Accounts', value: stats?.totalUsers, icon: Users, to: '/super-admin/users', color: 'text-sky-300' },
    { label: 'Courses', value: stats?.totalCourses, icon: GraduationCap, to: '/super-admin/academy', color: 'text-emerald-300' },
    { label: 'Research programs', value: stats?.totalResearchProjects, icon: BookOpen, to: '/super-admin/research', color: 'text-violet-300' },
    { label: 'Projects & products', value: (stats?.totalProjects || 0) + (stats?.totalProducts || 0), icon: Boxes, to: '/super-admin/projects', color: 'text-amber-300' },
  ];

  return <div className="space-y-7">
    <section className="overflow-hidden rounded-3xl border border-amber-300/20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300/10 via-slate-900/80 to-slate-950 p-6 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Global control plane</p><h2 className="text-3xl font-black sm:text-4xl">Platform command overview</h2><p className="mt-3 text-sm leading-6 text-slate-400">Manage identities, review platform changes, and reach every administrative workspace from one place.</p></div>
        <Link to="/super-admin/activity" className="flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-amber-200"><Activity className="h-4 w-4" /> Review activity <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </section>
    {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, to, color }) => <Link key={label} to={to} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-amber-300/40"><div className="flex items-center justify-between"><Icon className={`h-5 w-5 ${color}`} /><ArrowUpRight className="h-4 w-4 text-slate-600" /></div><p className="mt-5 text-3xl font-black">{value ?? '—'}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p></Link>)}
    </section>
    <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><div className="mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-amber-300" /><h3 className="font-bold">Latest platform events</h3></div>
        {payload?.auditLogs?.length ? <div className="divide-y divide-slate-800">{payload.auditLogs.slice(0, 8).map((log: any) => <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs"><div><span className="font-bold text-amber-200">{log.action}</span><span className="ml-2 text-slate-400">{log.entity}</span><p className="mt-1 text-slate-500">{log.user?.fullName || 'System'}</p></div><time className="text-slate-500">{new Date(log.createdAt).toLocaleString()}</time></div>)}</div> : <p className="py-5 text-sm text-slate-500">{payload ? 'No audit events recorded yet.' : 'Loading activity…'}</p>}
        <Link to="/super-admin/activity" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200">Open activity log <ArrowUpRight className="h-3 w-3" /></Link>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /><h3 className="font-bold">Super admin controls</h3></div>
        <div className="space-y-3">{[
          ['Identity and roles', 'Provision accounts and manage platform access.', '/super-admin/users'],
          ['Security and audit', 'Review governance and security records.', '/super-admin/security'],
          ['Content workspaces', 'Manage learning, research, technology, and content.', '/super-admin/academy'],
        ].map(([title, desc, to]) => <Link key={title} to={to} className="block rounded-xl border border-slate-800 p-4 hover:border-amber-300/30"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs text-slate-500">{desc}</p></Link>)}</div>
      </div>
    </section>
  </div>;
};

export default SuperAdminDashboardView;
