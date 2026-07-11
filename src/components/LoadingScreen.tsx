import { memo } from 'react';

/**
 * Modern loading skeleton used as the Suspense fallback
 * while route-level code is being fetched.
 */
function LoadingScreenBase() {
  return (
    <div className="px-3 sm:px-4 pt-3 pb-28 space-y-3 animate-fade-in" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-1">
        <div className="h-6 w-24 skeleton rounded-md" />
        <div className="h-3 w-16 skeleton rounded-md" />
      </div>

      {/* Chip rows */}
      <div className="flex gap-2 px-1">
        <div className="h-7 w-16 skeleton rounded-full" />
        <div className="h-7 w-20 skeleton rounded-full" />
        <div className="h-7 w-14 skeleton rounded-full" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="card space-y-2 h-28"
          >
            <div className="h-4 w-3/4 skeleton rounded" />
            <div className="h-2.5 w-full skeleton rounded" />
            <div className="h-2.5 w-5/6 skeleton rounded" />
            <div className="flex gap-1.5 mt-1.5">
              <div className="h-4 w-10 skeleton rounded-full" />
              <div className="h-4 w-8 skeleton rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(LoadingScreenBase);