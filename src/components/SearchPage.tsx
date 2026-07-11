import { memo, useCallback, useEffect, useState } from 'react';
import { usePromptStore, preloadSearch } from '../stores/usePromptStore';
import PromptCard from './PromptCard';
import PromptDetail from './PromptDetail';
import type { Prompt } from '../types';
import { SearchIcon, CloseIcon } from './icons';

function SearchPageBase() {
  const searchQuery = usePromptStore((s) => s.searchQuery);
  const setSearchQuery = usePromptStore((s) => s.setSearchQuery);
  const getSearchResults = usePromptStore((s) => s.getSearchResults);
  const prompts = usePromptStore((s) => s.prompts);

  const [selected, setSelected] = useState<Prompt | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    preloadSearch();
  }, []);

  const handleChange = useCallback(
    (val: string) => {
      setSearchQuery(val);
      setTimeout(() => setDebouncedQuery(val), 200);
    },
    [setSearchQuery]
  );

  const results = debouncedQuery ? getSearchResults() : [];

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, [setSearchQuery]);

  return (
    <div className="px-3 sm:px-4 pt-3 pb-28 space-y-3 animate-fade-in">
      <h1 className="text-xl font-semibold text-surface-50 tracking-tight px-1">Search</h1>

      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
          <SearchIcon size={16} />
        </span>
        <input
          className="input-field pl-10 pr-10 py-2.5 text-sm"
          placeholder="Search prompts, tags, body…"
          value={searchQuery}
          onChange={(e) => handleChange(e.target.value)}
          autoFocus
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Search prompts"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200 p-1.5 rounded-lg hover:bg-surface-800/50 transition-colors"
            aria-label="Clear search"
          >
            <CloseIcon size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {searchQuery && results.length === 0 && debouncedQuery === searchQuery && (
          <div className="col-span-full text-center py-16">
            <div className="text-surface-600 text-3xl mb-3">◌</div>
            <p className="text-surface-400 text-sm">No results for "{searchQuery}"</p>
            <p className="text-surface-500 text-xs mt-1">Try different keywords</p>
          </div>
        )}
        {!searchQuery && (
          <div className="col-span-full text-center py-16">
            <div className="text-surface-600 text-3xl mb-3">⌕</div>
            <p className="text-surface-400 text-sm">Type to search your prompts</p>
            <p className="text-surface-500 text-xs mt-1">
              {prompts.length === 0
                ? 'No prompts yet — add one first'
                : `${prompts.length} prompts indexed`}
            </p>
          </div>
        )}
        {results.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onTap={() => setSelected(prompt)}
          />
        ))}
      </div>

      {selected && (
        <PromptDetail prompt={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default memo(SearchPageBase);