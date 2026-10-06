import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, X, Cpu, BookOpen, GraduationCap, Globe, Shield, Sparkles, Building2, Code, Library, FileText, Users, Mail } from 'lucide-react';

interface EcosystemModulesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcosystemModulesSidebar: React.FC<EcosystemModulesSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const moduleCategories = [
    {
      title: 'Core & Governance',
      icon: Building2,
      items: [
        { label: 'Organization Structure', path: '/organization', icon: Building2 },
        { label: 'Technology Center', path: '/technology', icon: Cpu },
        { label: 'Technical Documentation', path: '/docs', icon: FileText },
        { label: 'News & Announcements', path: '/news', icon: Sparkles },
        { label: 'Careers & Fellows', path: '/careers', icon: Users },
        { label: 'Contact & Support', path: '/about/contact', icon: Mail },
      ],
    },
    {
      title: 'Research & Science',
      icon: Cpu,
      items: [
        { label: 'Research Initiatives', path: '/research', icon: Cpu },
        { label: 'Scientific Publications', path: '/publications', icon: FileText },
        { label: 'Knowledge Center', path: '/knowledge', icon: Library },
      ],
    },
    {
      title: 'Academy & Library',
      icon: GraduationCap,
      items: [
        { label: 'Academy LMS', path: '/academy', icon: GraduationCap },
        { label: 'Digital Library', path: '/library', icon: BookOpen },
      ],
    },
    {
      title: 'Innovation & AI',
      icon: Sparkles,
      items: [
        { label: 'ANR-X AI Hub', path: '/ai', icon: Sparkles },
        { label: 'Innovation Concepts', path: '/innovation', icon: Cpu },
        { label: 'Open Source Projects', path: '/projects', icon: Code },
        { label: 'Enterprise Products', path: '/products', icon: Layers },
        { label: 'Professional Services', path: '/services', icon: Shield },
        { label: 'Case Studies', path: '/case-studies', icon: FileText },
      ],
    },
    {
      title: 'Community & Network',
      icon: Globe,
      items: [
        { label: 'Community Discussions', path: '/community', icon: Globe },
        { label: 'Global Center', path: '/global', icon: Globe },
        { label: 'Media Center', path: '/media', icon: FileText },
        { label: 'Developers Portal', path: '/developers', icon: Code },
        { label: 'Personal Identity', path: '/personal', icon: Users },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-[#090d16] border-r border-slate-800 shadow-2xl flex flex-col p-6 overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Ecosystem Modules</h2>
              <p className="text-[10px] font-mono text-slate-400">Navigate All CADELIBORA Modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            aria-label="Close modules sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {moduleCategories.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-400 uppercase tracking-widest px-1">
                  <CatIcon className="w-4 h-4" />
                  <span>{cat.title}</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700/50"
                      >
                        <ItemIcon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
