import { memo, useCallback, useMemo, useRef } from 'react';
import type { Prompt } from '../types';
import { usePromptStore } from '../stores/usePromptStore';
import { getPlatformStyle } from '../lib/platforms';

interface Props {
  prompt: Prompt;
  onTap: () => void;
  showTags?: boolean;
}

function PromptCardBase({ prompt, onTap, showTags = true }: Props) {
  const toggleFavorite = usePromptStore((s) => s.toggleFavorite);
  const deletePrompt = usePromptStore((s) => s.deletePrompt);

  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    if (Math.abs(diff) > 10) isDragging.current = true;
    if (Math.abs(diff) > 50 && cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px)`;
      if (diff > 50) {
        cardRef.current.style.backgroundColor = 'rgba(34, 197, 94, 0.08)';
      } else if (diff < -50) {
        cardRef.current.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = currentX.current - startX.current;
    if (!cardRef.current) return;

    if (diff > 100) {
      cardRef.current.style.transform = 'translateX(150%)';
      cardRef.current.style.opacity = '0';
      setTimeout(() => {
        toggleFavorite(prompt.id);
        if (cardRef.current) {
          cardRef.current.style.transform = '';
          cardRef.current.style.opacity = '';
          cardRef.current.style.backgroundColor = '';
        }
      }, 200);
    } else if (diff < -100) {
      cardRef.current.style.transform = 'translateX(-150%)';
      cardRef.current.style.opacity = '0';
      setTimeout(() => {
        deletePrompt(prompt.id);
        if (cardRef.current) {
          cardRef.current.style.transform = '';
          cardRef.current.style.opacity = '';
          cardRef.current.style.backgroundColor = '';
        }
      }, 200);
    } else {
      cardRef.current.style.transform = '';
      cardRef.current.style.backgroundColor = '';
    }
    startX.current = 0;
    currentX.current = 0;
    isDragging.current = false;
  }, [prompt.id, toggleFavorite, deletePrompt]);

  const handleClick = useCallback(() => {
    if (!isDragging.current) onTap();
  }, [onTap]);

  const handleFavClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(prompt.id);
    },
    [prompt.id, toggleFavorite]
  );

  const bodyPreview = useMemo(
    () => (prompt.body.length > 160 ? prompt.body.slice(0, 160) + '…' : prompt.body),
    [prompt.body]
  );

  const platform = prompt.platform || '';
  const platformStyle = useMemo(() => getPlatformStyle(platform), [platform]);

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none rounded-2xl">
        <div className="text-green-500/40 text-[10px] font-medium">Favorite</div>
        <div className="text-red-500/40 text-[10px] font-medium">Delete</div>
      </div>
      <div
        ref={cardRef}
        data-card-id={prompt.id}
        className="card cursor-pointer relative z-10"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <h3 className="font-medium text-surface-50 text-sm leading-snug line-clamp-2 flex-1">
            {prompt.title}
          </h3>
          <button
            onClick={handleFavClick}
            className="shrink-0 -mr-1 -mt-1 p-1 rounded-lg hover:bg-surface-800/50 transition-colors"
            aria-label={prompt.is_favorite ? 'Unfavorite' : 'Favorite'}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={prompt.is_favorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              className={prompt.is_favorite ? 'text-red-400' : 'text-surface-500'}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <p className="text-surface-400 text-[11px] font-mono leading-relaxed mb-2 whitespace-pre-wrap line-clamp-3">
          {bodyPreview}
        </p>

        <div className="flex flex-wrap items-center gap-1 mb-1.5">
          {platform && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold border ${platformStyle.pill}`}
            >
              {platform}
            </span>
          )}
          {showTags && prompt.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-surface-800/50 text-surface-400 border border-surface-700/30"
            >
              #{tag}
            </span>
          ))}
          {showTags && prompt.tags.length > 2 && (
            <span className="text-[9px] text-surface-500">+{prompt.tags.length - 2}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-[9px] text-surface-500 tabular-nums">
          <span>{prompt.use_count} uses</span>
          <span>
            {new Date(prompt.updated_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(
  PromptCardBase,
  (prev, next) => prev.prompt === next.prompt && prev.onTap === next.onTap
);