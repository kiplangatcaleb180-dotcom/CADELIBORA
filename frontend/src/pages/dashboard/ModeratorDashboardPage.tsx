import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle2, Clock3, Flag, MessageSquare, ShieldAlert, UserRound, Users } from 'lucide-react';
import { fetchApi } from '../../lib/api';

type ModerationReport = {
  id: string; targetType: 'POST' | 'COMMENT' | 'USER'; targetId: string; reason: string; description: string;
  status: 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'ESCALATED'; resolutionNote: string; createdAt: string;
  reporter?: { id: string; fullName: string; role: string } | null; handler?: { fullName: string } | null; target?: any;
};
type DashboardData = { stats: Record<string, number>; reports: ModerationReport[]; recentActions: any[] };

const metrics = [
  { key: 'openReports', label: 'Open Reports', icon: Flag, filter: 'OPEN' },
  { key: 'newReports', label: 'New Reports (24h)', icon: AlertTriangle, filter: 'NEW' },
  { key: 'flaggedContent', label: 'Flagged Content', icon: ShieldAlert, filter: 'CONTENT' },
  { key: 'resolvedReports', label: 'Resolved Reports', icon: CheckCircle2, filter: 'RESOLVED' },
  { key: 'pendingReviews', label: 'Pending Reviews', icon: Clock3, filter: 'REVIEWING' },
  { key: 'communityActivity', label: 'Community Activity (24h)', icon: MessageSquare, filter: 'ALL' },
  { key: 'escalatedCases', label: 'Escalated Cases', icon: Activity, filter: 'ESCALATED' },
  { key: 'userReports', label: 'User Reports', icon: Users, filter: 'USERS' },
];

export const ModeratorDashboardPage: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setError('');
    try { setData(await fetchApi<DashboardData>('/moderation/dashboard')); }
    catch (err: any) { setError(err.message || 'Could not load moderation reports.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => {
    const slug = location.pathname.split('/').filter(Boolean).pop();
    if (slug === 'reports') setFilter('OPEN');
    else if (slug === 'flagged-content') setFilter('CONTENT');
    else if (slug === 'users') setFilter('USERS');
    else setFilter('ALL');
  }, [location.pathname]);

  const act = async (report: ModerationReport, action: string) => {
    if (action === 'REMOVE_CONTENT' && !window.confirm('Permanently remove this reported post or comment?')) return;
    if (action === 'SUSPEND_USER' && !window.confirm('Suspend this reported user account?')) return;
    setBusy(report.id);
    try {
      await fetchApi(`/moderation/reports/${report.id}`, { method: 'PATCH', body: JSON.stringify({ action, note: notes[report.id] || '' }) });
      await loadDashboard();
    } catch (err: any) { setError(err.message || 'Could not update this report.'); }
    finally { setBusy(null); }
  };

  const visibleReports = (data?.reports || []).filter((report) => {
    if (filter === 'ALL' || filter === 'OPEN') return report.status !== 'RESOLVED';
    if (filter === 'CONTENT') return ['POST', 'COMMENT'].includes(report.targetType) && report.status !== 'RESOLVED';
    if (filter === 'USERS') return report.targetType === 'USER' && report.status !== 'RESOLVED';
    if (filter === 'NEW') return new Date(report.createdAt).getTime() >= Date.now() - 24 * 60 * 60 * 1000;
    return report.status === filter;
  });

  return <div className="space-y-7">
    <section className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 via-slate-900 to-slate-950 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Community safety</p><h1 className="mt-2 text-3xl font-black text-white">Moderation dashboard</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">Review reports, investigate content and user concerns, and record moderation decisions.</p></div><div className="flex gap-2"><Link to="/dashboard/notifications" className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200">Notifications</Link><Link to="/dashboard/messages" className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200">Messages</Link></div></div>
    </section>
    {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</p>}
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ key, label, icon: Icon, filter: nextFilter }) => <button key={key} onClick={() => setFilter(nextFilter)} className={`rounded-2xl border p-4 text-left transition ${filter === nextFilter ? 'border-amber-300/50 bg-amber-300/10' : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'}`}><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-400">{label}</span><Icon className="h-4 w-4 text-amber-300" /></div><p className="mt-3 text-3xl font-black text-white">{loading ? '…' : data?.stats?.[key] ?? 0}</p></button>)}
    </section>
    <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-amber-300">Case queue</p><h2 className="mt-1 text-xl font-bold text-white">{filter === 'ALL' ? 'Open Reports' : filter === 'CONTENT' ? 'Flagged Content' : filter === 'USERS' ? 'User Reports' : filter === 'NEW' ? 'New Reports' : `${filter.charAt(0)}${filter.slice(1).toLowerCase()} Reports`}</h2></div><select value={filter} onChange={event => setFilter(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"><option value="ALL">All reports</option><option value="OPEN">Open</option><option value="REVIEWING">Pending reviews</option><option value="ESCALATED">Escalated</option><option value="RESOLVED">Resolved</option><option value="CONTENT">Flagged content</option><option value="USERS">User reports</option><option value="NEW">New (24h)</option></select></div>
        {loading ? <p className="py-8 text-center text-sm text-slate-400">Loading moderation queue…</p> : visibleReports.length === 0 ? <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300" /><p className="mt-3 font-semibold text-white">No reports in this queue</p><p className="mt-1 text-xs text-slate-500">New community reports will appear here.</p></div> : <div className="space-y-4">{visibleReports.map(report => <article key={report.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-amber-300/10 px-2 py-1 text-[10px] font-bold text-amber-200">{report.status}</span><span className="text-[10px] uppercase tracking-widest text-slate-500">{report.targetType} · {new Date(report.createdAt).toLocaleString()}</span></div><h3 className="mt-2 font-bold text-white">{report.reason}</h3></div><p className="text-xs text-slate-400">Reported by {report.reporter?.fullName || 'Former user'}</p></div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/70 p-3"><p className="text-sm font-semibold text-slate-200">{report.target?.title || report.target?.fullName || report.target?.post?.title || `${report.targetType} unavailable`}</p><p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-400">{report.target?.content || report.target?.post?.content || report.target?.accountStatus || report.description || 'No additional details provided.'}</p>{report.target?.author?.fullName && <p className="mt-2 text-[11px] text-slate-500">Content author: {report.target.author.fullName} ({report.target.author.role})</p>}</div>
          {report.resolutionNote && <p className="mt-2 text-xs text-slate-400">Last note: {report.resolutionNote}</p>}
          {report.status !== 'RESOLVED' && <><textarea value={notes[report.id] || ''} onChange={event => setNotes({ ...notes, [report.id]: event.target.value })} placeholder="Add an investigation or resolution note…" className="mt-3 min-h-16 w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-white" /><div className="mt-3 flex flex-wrap gap-2">{report.status === 'OPEN' && <button disabled={busy === report.id} onClick={() => act(report, 'REVIEW')} className="rounded-lg border border-sky-400/30 px-3 py-2 text-xs font-bold text-sky-200 disabled:opacity-50">Start review</button>}<button disabled={busy === report.id} onClick={() => act(report, 'RESOLVE')} className="rounded-lg border border-emerald-400/30 px-3 py-2 text-xs font-bold text-emerald-200 disabled:opacity-50">Resolve report</button><button disabled={busy === report.id} onClick={() => act(report, 'ESCALATE')} className="rounded-lg border border-amber-400/30 px-3 py-2 text-xs font-bold text-amber-200 disabled:opacity-50">Escalate</button>{['POST', 'COMMENT'].includes(report.targetType) && <button disabled={busy === report.id} onClick={() => act(report, 'REMOVE_CONTENT')} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-bold text-rose-200 disabled:opacity-50">Remove content</button>}{report.targetType === 'USER' && report.target?.accountStatus !== 'SUSPENDED' && <button disabled={busy === report.id} onClick={() => act(report, 'SUSPEND_USER')} className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs font-bold text-rose-200 disabled:opacity-50"><UserRound className="mr-1 inline h-3.5 w-3.5" />Suspend user</button>}{report.reporter && <Link to={`/dashboard/messages?recipientId=${encodeURIComponent(report.reporter.id)}`} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300">Message reporter</Link>}</div></>}
        </article>)}</div>}
      </div>
      <aside className="space-y-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-amber-300" /><h2 className="font-bold text-white">Recent Moderation Actions</h2></div><div className="mt-4 space-y-3">{data?.recentActions?.length ? data.recentActions.map((action: any) => <div key={action.id} className="border-l-2 border-amber-300/40 pl-3"><p className="text-xs font-bold text-slate-200">{action.action.replace('MODERATION_', '').replace(/_/g, ' ')}</p><p className="mt-1 text-[11px] text-slate-500">{action.user?.fullName || 'System'} · {new Date(action.createdAt).toLocaleString()}</p></div>) : <p className="text-xs text-slate-500">No moderation actions recorded yet.</p>}</div></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-sky-300" /><h2 className="font-bold text-white">Community Activity</h2></div><p className="mt-2 text-xs text-slate-400">{data?.stats?.communityActivity ?? '—'} posts and comments in the last 24 hours.</p><Link to="/community" className="mt-3 inline-block text-xs font-bold text-sky-300 hover:text-sky-200">Open community feed →</Link></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><h2 className="font-bold text-white">Moderator responsibilities</h2><ul className="mt-3 space-y-2 text-xs text-slate-400"><li>Review reported posts, comments, and users.</li><li>Resolve reports or record an escalation note.</li><li>Remove violating content or suspend accounts when warranted.</li><li>Notify reporters when a case is updated.</li></ul></div>
      </aside>
    </section>
  </div>;
};

export default ModeratorDashboardPage;
