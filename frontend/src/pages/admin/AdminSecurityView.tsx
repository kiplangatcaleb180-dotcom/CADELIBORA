import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';
import { DataTable, Column } from '../../components/admin/DataTable';
import { Shield, Lock, Activity, CheckCircle2 } from 'lucide-react';

export const AdminSecurityView: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetchApi<{ auditLogs: any[] }>('/admin/stats');
        setAuditLogs(res.auditLogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const cols: Column<any>[] = [
    { key: 'action', header: 'Action', render: (l) => <span className="font-bold text-brand-400">{l.action}</span> },
    { key: 'user', header: 'User Email', render: (l) => l.user?.email || 'System' },
    { key: 'entity', header: 'Target Entity', render: (l) => <span className="text-emerald-400">{l.entity}</span> },
    { key: 'ipAddress', header: 'IP Address' },
    { key: 'detailsJson', header: 'Activity Details', render: (l) => <span className="text-slate-400">{typeof l.detailsJson === 'string' ? l.detailsJson : JSON.stringify(l.detailsJson || {})}</span> },
    { key: 'createdAt', header: 'Timestamp', render: (l) => new Date(l.createdAt).toLocaleString() },
  ];

  if (loading) return <div className="p-12 text-center font-mono text-brand-400 animate-pulse">Loading Security Audit Logs...</div>;

  return (
    <div className="space-y-8 font-mono text-xs">
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyber-accent" />
          <span>Platform Activity & Security Audit</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400">Authentication Protocol:</span>
            <p className="text-white font-bold text-sm">JWT Bearer (HS256)</p>
            <span className="text-emerald-400 text-[10px]">7-day token expiry</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400">Password Cryptography:</span>
            <p className="text-white font-bold text-sm">bcrypt (Salt Factor 10)</p>
            <span className="text-emerald-400 text-[10px]">Protected</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400">Role Authorization (RBAC):</span>
            <p className="text-white font-bold text-sm">SUPER_ADMIN & ADMIN</p>
            <span className="text-emerald-400 text-[10px]">Guard Enforced</span>
          </div>
        </div>
      </div>

      <DataTable title="Recent Platform Activity (up to 100 events)" data={auditLogs} columns={cols} searchKey="action" />
    </div>
  );
};
