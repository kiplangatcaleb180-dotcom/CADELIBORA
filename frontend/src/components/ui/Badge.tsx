import React from 'react';
import clsx from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'emerald' | 'cyan' | 'amber' | 'red' | 'purple' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'blue', size = 'md', children, ...props }) => {
  const variants = {
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    red: 'bg-red-500/10 text-red-400 border border-red-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={clsx('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
