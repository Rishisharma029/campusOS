import React from 'react';
import { ChevronRight } from 'lucide-react';

// 1. ProgressBar Component
interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color = 'bg-blue-600', size = 'sm' }) => {
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
  };

  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
      <div
        className={`${color} h-full rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

// 2. SkeletonLoader Component
interface SkeletonLoaderProps {
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'rect', className = '' }) => {
  const styles = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-xl',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${styles[variant]} ${className}`} />
  );
};

// 3. EmptyState Component
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-surface/50 dark:bg-slate-900/50">
      {icon && <div className="mb-4 text-slate-400 dark:text-slate-600">{icon}</div>}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

// 4. Breadcrumbs Component
interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 py-1">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={12} className="text-slate-400" />}
            {isLast || !item.path ? (
              <span className={`font-medium ${isLast ? 'text-slate-900 dark:text-slate-100' : ''}`}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate && onNavigate(item.path!)}
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
