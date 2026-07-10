import { memo, useCallback, useEffect, useState } from 'react';
import type { PromptInput } from '../types';
import { usePromptStore } from '../stores/usePromptStore';
import { PLATFORM_FORM_OPTIONS } from '../lib/platforms';

interface Props {
  initial?: Partial<PromptInput>;
  onDone?: () => void;
}

function PromptFormBase({ initial, onDone }: Props) {
  const addPrompt = usePromptStore((s) => s.addPrompt);
  const shareText = usePromptStore((s) => s.shareText);
  const setShareText = usePromptStore((s) => s.setShareText);

  const [title, setTitle] = useState(initial?.title || '');
  const [body, setBody] = useState(initial?.body || '');
  const [platform, setPlatform] = useState(
    initial?.platform || PLATFORM_FORM_OPTIONS[0]
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [saving, setSaving] = useState(false);

  // Handle shared text
  useEffect(() => {
    if (shareText) {
      const lines = shareText.split('\n');
      if (lines[0] && lines[0].startsWith('# ')) {
        setTitle(lines[0].slice(2).trim());
        setBody(lines.slice(1).join('\n').trim());
      } else {
        setBody(shareText);
      }
      setShareText(null);
    }
  }, [shareText, setShareText]);

  const handleAddTag = useCallback(() => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput('');
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !body.trim()) return;
      setSaving(true);
      try {
        await addPrompt({
          title: title.trim(),
          body: body.trim(),
          platform,
          tags,
        });
        if (onDone) onDone();
      } finally {
        setSaving(false);
      }
    },
    [title, body, platform, tags, addPrompt, onDone]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  const canSubmit = !!title.trim() && !!body.trim() && !saving;

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label
          htmlFor="prompt-title"
          className="text-xs font-medium text-surface-300 mb-1 block"
        >
          Title
        </label>
        <input
          id="prompt-title"
          className="input-field py-2.5"
          placeholder="Give your prompt a name…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={120}
        />
      </div>

      <div>
        <label
          htmlFor="prompt-body"
          className="text-xs font-medium text-surface-300 mb-1 block"
        >
          Prompt Body
        </label>
        <textarea
          id="prompt-body"
          className="input-field min-h-[110px] font-mono resize-y py-2.5 text-sm"
          placeholder="Paste your prompt here…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium text-surface-300 mb-1 block">
          Platform
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {PLATFORM_FORM_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={`chip px-2.5 py-0.5 text-[11px] ${
                platform === p ? 'chip-active' : ''
              }`}
              aria-pressed={platform === p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="tag-input"
          className="text-xs font-medium text-surface-300 mb-1 block"
        >
          Tags
        </label>
        <div className="flex gap-1.5">
          <input
            id="tag-input"
            className="input-field flex-1 py-2.5"
            placeholder="Add tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="btn-secondary px-3 py-2 text-sm"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="chip text-[11px] pl-2 pr-1 py-0.5"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-surface-700 text-surface-400 hover:text-surface-200"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="btn-primary w-full py-2.5 text-sm"
      >
        {saving ? 'Saving…' : 'Save Prompt'}
      </button>
    </form>
  );
}

export default memo(PromptFormBase);
