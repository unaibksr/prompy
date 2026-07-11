import { memo, useCallback, useMemo, useState } from 'react';
import { usePromptStore } from '../stores/usePromptStore';
import PromptCard from './PromptCard';
import PromptDetail from './PromptDetail';
import type { Prompt, SortOption } from '../types';
import { PLATFORMS, PLATFORM_LABEL } from '../lib/platforms';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-used', label: 'Most Used' },
  { value: 'alphabetical', label: 'A–Z' },
];

function BrowsePageBase() {
  const prompts = usePromptStore((s) => s.prompts);
  const loading = usePromptStore((s) => s.loading);
  const error = usePromptStore((s) => s.error);
  const filterPlatform = usePromptStore((s) => s.filterPlatform);
  const filterTag = usePromptStore((s) => s.filterTag);
  const setFilterPlatform = usePromptStore((s) => s.setFilterPlatform);
  const sortBy = usePromptStore((s) => s.sortBy);
  const setSortBy = usePromptStore((s) => s.setSortBy);
  const getFilteredPrompts = usePromptStore((s) => s.getFilteredPrompts);

  const [selected, setSelected] = useState<Prompt | null>(null);

  const filtered = useMemo(
    () => getFilteredPrompts(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prompts, filterPlatform, filterTag, sortBy]
  );

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div className="px-3 sm:px-4 pt-3 pb-28 space-y-3 animate-fade-in">
      {/* Minimal header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl font-semibold text-surface-50 tracking-tight">Vault</h1>
        <p className="text-xs text-surface-400 tabular-nums">
          {prompts.length} prompt{prompts.length === 1 ? '' : 's'}
        </p>
      </div>

      {error && (
        <div
          role="status"
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3.5 py-2 text-xs text-yellow-400"
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="space-y-2">
        {/* Platform chips */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none -mx-1 px-1"
          role="tablist"
          aria-label="Filter by platform"
        >
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`chip shrink-0 text-xs ${
                filterPlatform === p ? 'chip-active' : ''
              }`}
              role="tab"
              aria-selected={filterPlatform === p}
            >
              {PLATFORM_LABEL[p]}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] uppercase tracking-widest text-surface-500 font-medium">Sort</span>
          <div className="flex gap-1 flex-wrap">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  sortBy === opt.value
                    ? 'bg-accent/15 text-accent-300 border border-accent/30'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
                aria-pressed={sortBy === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12" aria-busy="true">
          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      )}

      {/* Card grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filtered.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onTap={() => setSelected(prompt)}
              showTags={false}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-surface-600 text-3xl mb-3">◌</div>
              <p className="text-surface-400 text-sm">No prompts found</p>
              <p className="text-surface-500 text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {selected && <PromptDetail prompt={selected} onClose={handleClose} />}
    </div>
  );
}

export default memo(BrowsePageBase);