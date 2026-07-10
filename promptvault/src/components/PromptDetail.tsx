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
        <div className="sticky top-0 bg-surface-900 z-10 px-4 pt-3 pb-2.5 border-b border-surface-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base text-surface-50 leading-tight">
                {prompt.title}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {prompt.platform && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${platformStyle.pillLg}`}
                  >
                    {prompt.platform}
                  </span>
                )}
                {prompt.use_count > 0 && (
                  <span className="text-[10px] text-surface-500 tabular-nums">
                    {prompt.use_count}× used
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-ghost shrink-0 p-1.5"
              aria-label="Close"
            >
              <CloseIcon size={22} />
            </button>
          </div>
        </div>

        <div className="px-4 py-3 space-y-3.5">
          <div>
            <label className="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-1 block">
              Prompt
            </label>
            <div className="bg-surface-950 border border-surface-800 rounded-xl p-3 font-mono text-[13px] text-surface-200 whitespace-pre-wrap leading-snug max-h-56 overflow-y-auto">
              {prompt.body}
            </div>
          </div>

          {prompt.tags.length > 0 && (
            <div>
              <label className="text-[10px] font-medium text-surface-500 uppercase tracking-wider mb-1 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-1">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="chip text-[10px] px-2 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="btn-primary w-full text-sm py-2.5"
            aria-live="polite"
          >
            {copied ? (
              <>
                <CheckIcon size={18} />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon size={18} />
                Copy to Clipboard
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[10px] text-surface-500 pb-2 tabular-nums">
            <span>Created {new Date(prompt.created_at).toLocaleDateString()}</span>
            <span>Updated {new Date(prompt.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PromptDetailBase);
