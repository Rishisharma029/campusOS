import React, { useState } from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const colors = [
  'bg-blue-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-indigo-500 text-white',
  'bg-violet-500 text-white',
  'bg-teal-500 text-white',
  'bg-pink-500 text-white',
];

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '', ...props }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (userName: string) => {
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  };

  const getColorClass = (userName: string) => {
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const sizes = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 font-semibold select-none
        ${sizes[size]}
        ${!src || hasError ? getColorClass(name) : 'bg-slate-100 dark:bg-slate-800'}
        ${className}
      `}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
