import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, BookOpen, Box, Cpu, FileText, GraduationCap, Image, Layers, Lightbulb, LockKeyhole, LogOut, MessageSquare, Settings2, Shield, Users } from 'lucide-react';

const sections = [
  { label: 'Command overview', path: '/super-admin', icon: Shield },
  { label: 'Platform logo', path: '/super-admin/branding', icon: Image },
  { label: 'Identity & roles', path: '/super-admin/users', icon: Users },
  { label: 'Platform activity', path: '/super-admin/activity', icon: Activity },
  { label: 'Security', path: '/super-admin/security', icon: LockKeyhole },
  { label: 'Projects & products', path: '/super-admin/projects', icon: Box },
  { label: 'Research', path: '/super-admin/research', icon: Cpu },
  { label: 'Academy', path: '/super-admin/academy', icon: GraduationCap },
  { label: 'Innovation', path: '/super-admin/innovation', icon: Lightbulb },
  { label: 'Organization', path: '/super-admin/organization', icon: Layers },
  { label: 'Technology', path: '/super-admin/technology', icon: Settings2 },
  { label: 'Library', path: '/super-admin/library', icon: BookOpen },
  { label: 'Content', path: '/super-admin/articles', icon: FileText },
  { label: 'Community & services', path: '/super-admin/community', icon: MessageSquare },
];

export const SuperAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080b13] text-slate-100">
      <header className="border-b border-amber-300/20 bg-gradient-to-r from-[#111827] via-[#11111d] to-[#17120c]">
        <div className="mx-auto max-w-[1600px] px-5 py-5 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-3"><Shield className="h-6 w-6 text-amber-300" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">CADELIBORA · ROOT ACCESS</p>
                <h1 className="text-xl font-black tracking-tight sm:text-2xl">Super Administrator Console</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user?.fullName}</p><p className="text-[10px] font-bold tracking-widest text-amber-300">SUPER ADMIN</p></div>
              <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-rose-400/50 hover:text-rose-300"><LogOut className="h-4 w-4" /> Sign out</button>
            </div>
          </div>
          <nav aria-label="Super admin navigation" className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {sections.map(({ label, path, icon: Icon }) => {
              const active = path === '/super-admin' ? location.pathname === path || location.pathname === `${path}/` : location.pathname.startsWith(path);
              return <Link key={path} to={path} className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${active ? 'border-amber-300/50 bg-amber-300/10 text-amber-200' : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}><Icon className="h-4 w-4" />{label}</Link>;
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default SuperAdminLayout;
