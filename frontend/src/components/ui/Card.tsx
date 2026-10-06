import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverEffect = false, glow = false, children, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 text-slate-100 shadow-xl transition-all duration-300',
        hoverEffect && 'hover:border-blue-500/50 hover:shadow-blue-500/10 hover:-translate-y-1',
        glow && 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:via-cyan-500/10 before:to-emerald-500/10 before:opacity-50 before:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('flex flex-col space-y-1.5 pb-4', className)} {...props}>{children}</div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={clsx('text-lg font-semibold tracking-tight text-slate-100', className)} {...props}>{children}</h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={clsx('text-sm text-slate-400', className)} {...props}>{children}</p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('text-slate-300', className)} {...props}>{children}</div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('flex items-center pt-4 border-t border-slate-800 mt-4', className)} {...props}>{children}</div>
);
