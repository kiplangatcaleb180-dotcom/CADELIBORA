import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { ArrowRight, BarChart3, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui';
import { AnalyticsSection } from '../../components/dashboard/analytics/AnalyticsSection';
import { useAuth } from '../../contexts/AuthContext';
import { fetchApi } from '../../lib/api';
import { getDashboardRoleConfig } from '../../config/dashboardRoles';

type Metric = { label: string; value: string | number };
type ChartRow = Record<string, string | number>;
type DashboardAnalytics = {
  success: boolean;
  role: string;
  generatedAt: string;
  kpis: { primary?: Metric[]; secondary?: Metric[] };
  charts: Record<string, ChartRow[]>;
};

const COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#fbbf24', '#f87171', '#22d3ee'];
const humanize = (value: string) => value
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/[_-]/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

function ChartCard({ name, rows }: { name: string; rows: ChartRow[] }) {
  const first = rows[0] || {};
  const categoryKey = 'label' in first ? 'label' : 'name' in first ? 'name' : '';
  const valueKeys = Object.keys(first).filter((key) => key !== categoryKey && typeof first[key] === 'number');
  const pie = /status|composition|categor|action/i.test(name) && valueKeys.length === 1;
  const trend = /activity|trend|monthly|progress/i.test(name) && categoryKey.length > 0;

  return (
    <AnalyticsSection title={humanize(name)}>
      {!rows.length || !valueKeys.length ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">No data available yet.</div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {pie ? (
              <PieChart>
                <Pie data={rows} dataKey={valueKeys[0]} nameKey={categoryKey || valueKeys[0]} cx="50%" cy="50%" innerRadius={58} outerRadius={100} paddingAngle={3}>
                  {rows.map((row, index) => <Cell key={`${String(row[categoryKey] ?? index)}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,.18)', borderRadius: 12, color: '#fff' }} />
              </PieChart>
            ) : trend ? (
              <AreaChart data={rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs><linearGradient id={`fill-${name}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity={0.35} /><stop offset="100%" stopColor="#60a5fa" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.12)" />
                <XAxis dataKey={categoryKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,.18)', borderRadius: 12, color: '#fff' }} />
                {valueKeys.map((key, index) => <Area key={key} type="monotone" dataKey={key} name={humanize(key)} stroke={COLORS[index % COLORS.length]} fill={index === 0 ? `url(#fill-${name})` : 'transparent'} strokeWidth={2} />)}
              </AreaChart>
            ) : (
              <BarChart data={rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.12)" />
                <XAxis dataKey={categoryKey || valueKeys[0]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,.18)', borderRadius: 12, color: '#fff' }} />
                {valueKeys.map((key, index) => <Bar key={key} dataKey={key} name={humanize(key)} fill={COLORS[index % COLORS.length]} radius={[5, 5, 0, 0]} maxBarSize={42} />)}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsSection>
  );
}

export const DashboardOverview: React.FC<{ analyticsOnly?: boolean }> = ({ analyticsOnly = false }) => {
  const { user } = useAuth();
  const role = user?.role || 'USER';
  const config = getDashboardRoleConfig(role);
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setData(null);
    setError('');
    fetchApi<DashboardAnalytics>('/dashboard/analytics/overview')
      .then((result) => { if (active) setData(result); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : 'Unable to load analytics.'); });
    return () => { active = false; };
  }, [role]);

  const metrics = [...(data?.kpis?.primary || []), ...(analyticsOnly ? data?.kpis?.secondary || [] : [])];
  const chartEntries = Object.entries(data?.charts || {}).filter(([, rows]) => Array.isArray(rows));

  return (
    <div className="space-y-8">
      {!analyticsOnly && <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p className="text-sm font-medium text-blue-400">{config.label}</p><h1 className="mt-2 text-3xl font-bold text-white">{role === 'STUDENT' ? 'Learning Overview' : `${humanize(role.toLowerCase())} Overview`}</h1><p className="mt-2 max-w-3xl text-slate-400">Your role specific activity, performance, and progress at a glance.</p></div>
        <Link to={config.navItems.find((item) => item.path !== '/dashboard')?.path || '/dashboard/profile'} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">Open Workspace<ArrowRight className="h-4 w-4" /></Link>
      </section>}

      {error && <Card><CardContent className="text-sm text-rose-300">{error}</CardContent></Card>}

      {metrics.length > 0 && <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <Card key={metric.label}><CardContent><p className="text-sm text-slate-400">{metric.label}</p><p className="mt-2 text-3xl font-bold text-white">{metric.value}</p></CardContent></Card>)}
      </section>}

      <section className="space-y-4">
        <div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-blue-400" /><h2 className="text-xl font-semibold text-white">{analyticsOnly ? 'Analytics' : 'Your Analytics'}</h2></div>
        {!data && !error ? <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" />Loading your analytics…</div> : chartEntries.length > 0 ? <div className="grid gap-6 xl:grid-cols-2">{chartEntries.map(([name, rows]) => <ChartCard key={name} name={name} rows={rows} />)}</div> : <Card><CardContent className="py-10 text-center text-sm text-slate-400">No analytics are available for this account yet.</CardContent></Card>}
      </section>
    </div>
  );
};
