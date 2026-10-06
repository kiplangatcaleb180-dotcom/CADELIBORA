import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-55 disabled:pointer-events-none cursor-pointer rounded-lg';

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 border border-blue-500/30',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
      outline: 'border border-slate-700 bg-transparent hover:bg-slate-800/60 text-slate-200',
      ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
      destructive: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25',
      link: 'bg-transparent text-blue-400 hover:underline p-0 h-auto'
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
      icon: 'p-2 aspect-square'
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
