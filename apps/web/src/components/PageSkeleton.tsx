import React from "react";

export const PageSkeleton: React.FC = () => {
  return (
    <div className="p-8 space-y-6 animate-pulse" role="status" aria-label="Loading page content">
      <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default PageSkeleton;
