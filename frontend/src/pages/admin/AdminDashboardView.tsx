import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import {
  Users,
  GraduationCap,
  Cpu,
  Box,
  BookOpen,
  MessageSquare,
  Activity,
  Shield,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState({
    database: 'UNKNOWN',
    api: 'UNKNOWN',
    ai: 'UNKNOWN',
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi<{ stats: any; auditLogs: any[] }>('/admin/stats');
        setStats(res.stats);
        setAuditLogs(res.auditLogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();

    async function loadSystemHealth() {
      try {
        const [healthResponse, aiResponse] = await Promise.allSettled([
          fetchApi<{
            status: string;
            services?: {
              api?: string;
              database?: string;
            };
          }>('/../health'),
          fetchApi<{
            status: string;
            provider?: string;
            providers?: {
              mistral?: string;
              gemini?: string;
            };
          }>('/ai/health'),
        ]);

        setSystemHealth({
          api:
            healthResponse.status === 'fulfilled'
              ? healthResponse.value.services?.api || 'UNKNOWN'
              : 'UNAVAILABLE',
          database:
            healthResponse.status === 'fulfilled'
              ? healthResponse.value.services?.database || 'UNKNOWN'
              : 'UNAVAILABLE',
          ai:
            aiResponse.status === 'fulfilled'
              ? aiResponse.value.status
              : 'UNAVAILABLE',
        });
      } catch (err) {
        console.error('System health check failed:', err);

        setSystemHealth({
          api: 'UNAVAILABLE',
          database: 'UNAVAILABLE',
          ai: 'UNAVAILABLE',
        });
      }
    }

    loadSystemHealth();
  }, []);

  if (loading) return <div className="p-12 text-center font-mono text-brand-400 animate-pulse">Initializing Command Center Metrics...</div>;

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-2 text-center">
          <Users className="w-6 h-6 mx-auto text-brand-400" />
          <p className="text-3xl font-black font-mono text-white">{stats?.totalUsers || 0}</p>
          <p className="text-slate-400 font-bold uppercase">Registered Accounts</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-2 text-center">
          <GraduationCap className="w-6 h-6 mx-auto text-emerald-400" />
          <p className="text-3xl font-black font-mono text-white">{stats?.totalCourses || 0}</p>
          <p className="text-slate-400 font-bold uppercase">Academy Courses</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-2 text-center">
          <Cpu className="w-6 h-6 mx-auto text-purple-400" />
          <p className="text-3xl font-black font-mono text-white">{stats?.totalResearchProjects || 0}</p>
          <p className="text-slate-400 font-bold uppercase">Research Initiatives</p>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-2 text-center">
          <Box className="w-6 h-6 mx-auto text-cyber-accent" />
          <p className="text-3xl font-black font-mono text-white">{stats?.totalProducts || 0}</p>
          <p className="text-slate-400 font-bold uppercase">Enterprise Products</p>
        </div>
      </div>

      {/* System Health & Activity Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Health Card */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Infrastructure Health</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Database Engine:</span>
              <span className={`font-bold ${systemHealth.database === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                PostgreSQL / Prisma ({systemHealth.database})
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">REST API Engine:</span>
              <span className={`font-bold ${systemHealth.api === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                Express ({systemHealth.api})
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">AI Service:</span>
              <span className={`font-bold ${systemHealth.ai === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                ANR-X ({systemHealth.ai})
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Security Guardrails:</span>
              <span className="text-emerald-400 font-bold">ENFORCED (JWT + RBAC)</span>
            </div>
          </div>
        </div>

        {/* Content & Activity Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <span>Ecosystem Content Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
              <BookOpen className="w-5 h-5 text-brand-400 mx-auto" />
              <p className="text-xl font-bold text-white">{stats?.totalLibraryResources || 0}</p>
              <p className="text-[10px] text-slate-400">Library Items</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
              <MessageSquare className="w-5 h-5 text-cyber-accent mx-auto" />
              <p className="text-xl font-bold text-white">{stats?.totalCommunityPosts || 0}</p>
              <p className="text-[10px] text-slate-400">Discussions</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
              <Zap className="w-5 h-5 text-purple-400 mx-auto" />
              <p className="text-xl font-bold text-white">{stats?.totalArticles || 0}</p>
              <p className="text-[10px] text-slate-400">Press Articles</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
              <Award className="w-5 h-5 text-emerald-400 mx-auto" />
              <p className="text-xl font-bold text-white">{stats?.totalEnrollments || 0}</p>
              <p className="text-[10px] text-slate-400">Enrollments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Audit Feed */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyber-accent" />
          <span>Recent Security & Audit Trail</span>
        </h3>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-brand-400 font-bold">{log.action}</span>
                <span className="text-slate-500 mx-2">|</span>
                <span>User: {log.user?.email || 'System'}</span>
                <span className="text-slate-500 mx-2">|</span>
                <span className="text-slate-400">Entity: {log.entity}</span>
              </div>
              <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
