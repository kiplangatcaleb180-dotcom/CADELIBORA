import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Sun, Moon, Bell, User, LogOut, Menu, X, Sparkles, Shield, Cpu, GraduationCap, BookOpen, Layers } from 'lucide-react';
import { CommandMenu } from './CommandMenu';
import { EcosystemModulesSidebar } from './EcosystemModulesSidebar';
import { fetchApi } from '../../lib/api';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [modulesSidebarOpen, setModulesSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [platformLogo, setPlatformLogo] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const loadBranding = () => fetchApi<{ logo: string | null }>('/branding').then((result) => { if (active) setPlatformLogo(result.logo); }).catch(() => undefined);
    loadBranding();
    window.addEventListener('platform-branding-updated', loadBranding);
    return () => { active = false; window.removeEventListener('platform-branding-updated', loadBranding); };
  }, []);

  useEffect(() => {
    if (!platformLogo) return;
    let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) { icon = document.createElement('link'); icon.rel = 'icon'; document.head.appendChild(icon); }
    icon.href = platformLogo;
  }, [platformLogo]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Ecosystem Modules Trigger */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-cyber-accent to-cyber-neon p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  {platformLogo ? <img src={platformLogo} alt="CADELIBORA platform logo" className="h-full w-full object-contain" /> : <Cpu className="w-6 h-6 text-brand-400 group-hover:rotate-12 transition-transform" />}
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white font-mono">
                  CADELIBORA
                </span>
              </div>
            </Link>

            <button
              onClick={() => setModulesSidebarOpen(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/15 border border-brand-500/40 text-brand-400 hover:bg-brand-500/25 text-xs font-bold transition-all shadow-sm"
            >
              <Layers className="w-4 h-4" />
              <span>All Modules</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Command Menu Search Trigger */}
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 text-slate-400 text-xs font-mono transition-all"
            >
              <Search className="w-4 h-4 text-brand-400" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 rounded text-slate-300 border border-slate-700">Ctrl+K</kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Auth Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 transition-all"
                  aria-label="User profile menu"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-500/50"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 glass-panel">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-slate-200">{user.fullName}</p>
                      <p className="text-[10px] font-mono text-brand-400 uppercase tracking-wider">{user.role}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                    >
                      <User className="w-4 h-4 text-brand-400" />
                      Personal Dashboard
                    </Link>

                    <Link
                      to="/dashboard/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                    >
                      <User className="w-4 h-4 text-cyan-400" />
                      Profile Settings
                    </Link>

                    {(user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && (
                      <Link
                        to={user.role === 'SUPER_ADMIN' ? '/super-admin' : '/admin'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-cyber-accent hover:bg-slate-800 rounded-lg"
                      >
                        <Shield className="w-4 h-4 text-cyber-accent" />
                        {user.role === 'SUPER_ADMIN' ? 'Super Admin Console' : 'Admin Workspace'}
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-cyber-accent hover:from-brand-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-brand-500/25 transition-all"
                >
                  Join CADELIBORA
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-4 pb-6 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setModulesSidebarOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-500/15 border border-brand-500/40 text-brand-400 text-xs font-bold mb-3"
            >
              <Layers className="w-4 h-4" />
              <span>Explore All Ecosystem Modules</span>
            </button>
          </div>
        )}
      </header>

      {/* Global Command Menu Dialog */}
      <CommandMenu isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />

      {/* Ecosystem Modules Sidebar Drawer */}
      <EcosystemModulesSidebar isOpen={modulesSidebarOpen} onClose={() => setModulesSidebarOpen(false)} />
    </>
  );
};
