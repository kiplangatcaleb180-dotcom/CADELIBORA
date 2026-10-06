import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text, className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center p-8 gap-3', className)}>
      <Loader2 className={clsx('animate-spin text-blue-500', sizes[size])} />
      {text && <p className="text-sm text-slate-400 font-medium">{text}</p>}
    </div>
  );
};
