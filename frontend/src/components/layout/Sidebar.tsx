import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, BookOpen, GraduationCap, Cpu, Shield, Users, Bell, Settings, Award, FolderGit2, BookMarked, User as UserIcon, MessageSquare, ShoppingBag } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const userNav = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', path: '/dashboard/courses', icon: GraduationCap },
    { label: 'Certificates', path: '/dashboard/certificates', icon: Award },
    { label: 'Research Saved', path: '/dashboard/research', icon: Cpu },
    { label: 'Projects', path: '/dashboard/projects', icon: FolderGit2 },
    { label: 'Library', path: '/dashboard/library', icon: BookMarked },
    { label: 'Orders & Services', path: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Profile', path: '/dashboard/profile', icon: UserIcon },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'Admin Analytics', path: '/admin', icon: LayoutDashboard },
    { label: 'User & RBAC Manager', path: '/admin/users', icon: Users },
    { label: 'Course Management', path: '/admin/courses', icon: GraduationCap },
    { label: 'Research & Papers', path: '/admin/research', icon: Cpu },
    { label: 'Audit Logs', path: '/admin/security', icon: Shield },
  ];

  const navItems = location.pathname.startsWith('/admin') ? adminNav : userNav;

  return (
    <aside className="w-64 min-h-screen bg-slate-900/90 border-r border-slate-800 p-4 space-y-6 glass-panel shrink-0">
      <div className="px-3 py-2 border-b border-slate-800">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-400">
          {location.pathname.startsWith('/super-admin') ? 'SUPER ADMIN CONSOLE' : location.pathname.startsWith('/admin') ? 'ADMINISTRATION PORTAL' : 'PERSONAL WORKSPACE'}
        </p>
        <p className="text-sm font-bold text-slate-100 truncate mt-1">{user?.fullName}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 text-brand-400" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
