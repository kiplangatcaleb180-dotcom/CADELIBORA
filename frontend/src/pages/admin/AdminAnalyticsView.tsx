import React, { useState, useEffect } from 'react';
import { BarChart2, Settings, Users, BookOpen, Award, Cpu, FolderGit2, BookMarked, MessageSquare, Activity } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export const AdminAnalyticsView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi<{ success: boolean; stats: any; auditLogs: any[] }>('/admin/stats');
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Real Platform Analytics Overview */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-brand-400" />
            <span>Platform Intelligence & Real Database Statistics</span>
          </h2>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PostgreSQL Live
          </span>
        </div>

        {loading ? (
          <p className="text-brand-400 text-sm animate-pulse py-8 text-center">Loading platform metrics...</p>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><Users className="w-4 h-4 text-brand-400" /> Total Users:</span>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-brand-400" /> Academy Courses:</span>
              <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-400" /> Course Enrollments:</span>
              <p className="text-3xl font-bold text-white">{stats.totalEnrollments}</p>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> Research Initiatives:</span>
              <p className="text-3xl font-bold text-white">{stats.totalResearchProjects}</p>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><FolderGit2 className="w-4 h-4 text-purple-400" /> Projects & Products:</span>
              <p className="text-3xl font-bold text-white">{stats.totalProducts + (stats.totalProjects || 0)}</p>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-brand-400" /> Community Posts:</span>
              <p className="text-3xl font-bold text-white">{stats.totalCommunityPosts}</p>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><BookMarked className="w-4 h-4 text-amber-400" /> Library Resources:</span>
              <p className="text-3xl font-bold text-white">{stats.totalLibraryResources}</p>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-400" /> Published Articles:</span>
              <p className="text-3xl font-bold text-white">{stats.totalArticles}</p>
            </div>
          </div>
        ) : (
          <p className="text-rose-400 text-center py-6">Unable to load analytics statistics.</p>
        )}
      </div>

      {/* Global System Configuration */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyber-accent" />
          <span>Global System Configuration</span>
        </h2>

        <div className="space-y-3">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Public User Registration</p>
              <p className="text-slate-400">Allow new students and researchers to create accounts</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">ENABLED</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">AI Chat Rate Limiting</p>
              <p className="text-slate-400">30 requests per minute for authenticated AI chat</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
