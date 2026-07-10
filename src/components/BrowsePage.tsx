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
  const setFilterTag = usePromptStore((s) => s.setFilterTag);
  const sortBy = usePromptStore((s) => s.sortBy);
  const setSortBy = usePromptStore((s) => s.setSortBy);
  const getFilteredPrompts = usePromptStore((s) => s.getFilteredPrompts);

  const [selected, setSelected] = useState<Prompt | null>(null);

  const filtered = useMemo(
    () => getFilteredPrompts(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prompts, filterPlatform, filterTag, sortBy]
  );

  // Extract unique tags from prompts (only when prompts list changes)
  const allTags = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [prompts]);

  const handleClose = useCallback(() => setSelected(null), []);
  const handleClearTag = useCallback(() => setFilterTag(''), [setFilterTag]);

  return (
    <div className="px-2.5 sm:px-3 pt-2 pb-24 space-y-2.5">
      {/* Compact header */}
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <h1 className="text-lg font-bold text-surface-50 leading-none">PromptVault</h1>
        <p className="text-[11px] text-surface-500 tabular-nums">
          {prompts.length} prompt{prompts.length === 1 ? '' : 's'}
        </p>
      </div>

      {error && (
        <div
          role="status"
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5 text-xs text-yellow-400"
        >
          {error}
        </div>
      )}

      {/* Compact filters */}
      <div className="space-y-1.5">
        {/* Platform chips */}
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none -mx-0.5 px-0.5"
          role="tablist"
          aria-label="Filter by platform"
        >
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`chip shrink-0 px-2.5 py-0.5 text-[11px] ${
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
        <div className="flex items-center gap-1.5 pt-0.5 px-0.5">
          <span className="text-[10px] uppercase tracking-wider text-surface-500">Sort</span>
          <div className="flex gap-1 flex-wrap">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-all duration-150 ${
                  sortBy === opt.value
                    ? 'bg-accent/20 text-accent-300 border-accent/30'
                    : 'bg-surface-900 text-surface-400 border-surface-800 hover:text-surface-200'
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
        <div className="flex items-center justify-center py-8" aria-busy="true">
          <div className="animate-spin rounded-full h-7 w-7 border-2 border-accent border-t-transparent" />
        </div>
      )}

      {/* Denser grid: 2 cols on phone, 3 on sm, 4 on lg */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {filtered.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onTap={() => setSelected(prompt)}
              showTags={false}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-surface-500 text-sm">No prompts found</p>
              <p className="text-surface-600 text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {selected && <PromptDetail prompt={selected} onClose={handleClose} />}
    </div>
  );
}

export default memo(BrowsePageBase);
