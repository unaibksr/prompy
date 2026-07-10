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
    <div className="px-2.5 sm:px-3 pt-2 pb-24 space-y-3.5">
      <h1 className="text-lg font-bold text-surface-50 leading-none px-0.5">Favorites</h1>

      {recentlyUsed.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-1.5 px-0.5">
            <h2 className="text-[11px] font-medium text-surface-500 uppercase tracking-wider">
              Recently Used
            </h2>
            <span className="text-[10px] text-surface-600 tabular-nums">
              {recentlyUsed.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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
        <div className="flex items-baseline justify-between mb-1.5 px-0.5">
          <h2 className="text-[11px] font-medium text-surface-500 uppercase tracking-wider">
            Favorites
          </h2>
          <span className="text-[10px] text-surface-600 tabular-nums">
            {favorites.length}
          </span>
        </div>
        {favorites.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto mb-2 text-surface-600 w-10 h-10 flex items-center justify-center">
              <HeartIcon size={40} />
            </div>
            <p className="text-surface-500 text-sm">No favorites yet</p>
            <p className="text-surface-600 text-xs mt-1">
              Swipe right on a prompt to favorite it
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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
