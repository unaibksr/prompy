import { memo, useMemo, useState } from 'react';
import { usePromptStore } from '../stores/usePromptStore';
import PromptCard from './PromptCard';
import PromptDetail from './PromptDetail';
import type { Prompt } from '../types';
import { HeartIcon } from './icons';

function FavoritesPageBase() {
  const prompts = usePromptStore((s) => s.prompts);
  const recentlyUsed = usePromptStore((s) => s.recentlyUsed);
  const [selected, setSelected] = useState<Prompt | null>(null);

  const favorites = useMemo(
    () => prompts.filter((p) => p.is_favorite),
    [prompts]
  );

  return (
    <div className="px-3 sm:px-4 pt-3 pb-28 space-y-4 animate-fade-in">
      <h1 className="text-xl font-semibold text-surface-50 tracking-tight px-1">Favorites</h1>

      {recentlyUsed.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-2 px-1">
            <h2 className="text-[10px] font-medium text-surface-500 uppercase tracking-widest">
              Recently Used
            </h2>
            <span className="text-[10px] text-surface-600 tabular-nums">
              {recentlyUsed.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {recentlyUsed.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onTap={() => setSelected(prompt)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between mb-2 px-1">
          <h2 className="text-[10px] font-medium text-surface-500 uppercase tracking-widest">
            Favorites
          </h2>
          <span className="text-[10px] text-surface-600 tabular-nums">
            {favorites.length}
          </span>
        </div>
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-3 text-surface-600 w-10 h-10 flex items-center justify-center">
              <HeartIcon size={36} />
            </div>
            <p className="text-surface-400 text-sm">No favorites yet</p>
            <p className="text-surface-500 text-xs mt-1">
              Swipe right on a prompt to favorite it
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {favorites.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onTap={() => setSelected(prompt)}
              />
            ))}
          </div>
        )}
      </section>

      {selected && (
        <PromptDetail prompt={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default memo(FavoritesPageBase);