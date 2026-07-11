import { memo, useCallback, useState } from 'react';
import type { Prompt } from '../types';
import { usePromptStore } from '../stores/usePromptStore';
import { CloseIcon, CopyIcon, CheckIcon } from './icons';
import { getPlatformStyle } from '../lib/platforms';

interface Props {
  prompt: Prompt;
  onClose: () => void;
}

function PromptDetailBase({ prompt, onClose }: Props) {
  const usePrompt = usePromptStore((s) => s.usePrompt);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt.body);
      setCopied(true);
      void usePrompt(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt.body;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
      setCopied(true);
      void usePrompt(prompt.id);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt.body, prompt.id, usePrompt]);

  const platformStyle = getPlatformStyle(prompt.platform);

  return (
    <>
      <div
        className="bottom-sheet-backdrop animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="bottom-sheet open"
        style={{ transform: 'translateY(0)' }}
        role="dialog"
        aria-label={prompt.title}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-900/95 backdrop-blur-xl z-10 px-5 pt-4 pb-3 border-b border-surface-800/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base text-surface-50 leading-tight">
                {prompt.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {prompt.platform && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${platformStyle.pillLg}`}
                  >
                    {prompt.platform}
                  </span>
                )}
                {prompt.use_count > 0 && (
                  <span className="text-[10px] text-surface-500 tabular-nums">
                    {prompt.use_count} uses
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost shrink-0 p-1.5 rounded-xl"
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Prompt body */}
          <div>
            <label className="text-[10px] font-medium text-surface-500 uppercase tracking-widest mb-2 block">
              Prompt
            </label>
            <div className="bg-surface-950/80 border border-surface-800/50 rounded-xl p-4 font-mono text-[13px] text-surface-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {prompt.body}
            </div>
          </div>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div>
              <label className="text-[10px] font-medium text-surface-500 uppercase tracking-widest mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="chip text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="btn-primary w-full text-sm py-2.5"
            aria-live="polite"
          >
            {copied ? (
              <>
                <CheckIcon size={16} />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon size={16} />
                Copy to Clipboard
              </>
            )}
          </button>

          {/* Dates */}
          <div className="flex items-center justify-between text-[10px] text-surface-600 pb-2 tabular-nums">
            <span>Created {new Date(prompt.created_at).toLocaleDateString()}</span>
            <span>Updated {new Date(prompt.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PromptDetailBase);