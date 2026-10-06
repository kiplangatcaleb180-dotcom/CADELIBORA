import React from 'react';

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  className?: string;
  alt?: string;
}

const getInitials = (name?: string | null) => {
  const value = (name || '').trim();

  if (!value) return '?';

  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export default function Avatar({
  name,
  src,
  className = 'w-8 h-8 rounded-lg',
  alt,
}: AvatarProps) {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? 'User avatar'}
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt ?? name ?? 'User avatar'}
      className={`${className} flex items-center justify-center bg-slate-800 border border-slate-700 text-brand-400 font-bold text-[10px] uppercase select-none`}
    >
      {initials}
    </div>
  );
}
