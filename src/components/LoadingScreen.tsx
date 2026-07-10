import { memo } from 'react';

/**
 * Lightweight loading skeleton used as the Suspense fallback
 * while route-level code is being fetched.
 */
function LoadingScreenBase() {
  return (
    <div className="px-4 pt-4 pb-28 space-y-4 animate-fade-in" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 skeleton rounded-md" />
          <div className="h-3 w-24 skeleton rounded-md" />
        </div>
      </div>

      {/* Chip rows skeleton */}
      <div className="flex gap-2">
        <div className="h-7 w-16 skeleton rounded-full" />
        <div className="h-7 w-20 skeleton rounded-full" />
        <div className="h-7 w-14 skeleton rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-20 skeleton rounded-full" />
        <div className="h-7 w-16 skeleton rounded-full" />
        <div className="h-7 w-24 skeleton rounded-full" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-900 border border-surface-800 rounded-2xl p-4 space-y-2 h-32"
          >
            <div className="h-4 w-3/4 skeleton rounded" />
            <div className="h-3 w-full skeleton rounded" />
            <div className="h-3 w-5/6 skeleton rounded" />
            <div className="flex gap-1.5 mt-2">
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
