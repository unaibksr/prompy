/**
 * Centralized definitions for the prompt "platform" (category).
 * Adding a new platform = add it here once and every chip / badge updates.
 */

export const PLATFORMS = ['', 'Nanobanana', 'Chatgpt', 'Study'] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABEL: Record<Platform, string> = {
  '': 'All',
  Nanobanana: 'Nanobanana',
  Chatgpt: 'Chatgpt',
  Study: 'Study',
};

export const PLATFORM_FORM_OPTIONS = PLATFORMS.filter((p) => p !== '');

interface PlatformStyle {
  /** Tailwind classes for an inline pill (small). */
  pill: string;
  /** Tailwind classes for a slightly larger pill (detail). */
  pillLg: string;
  /** Solid background gradient for a featured badge. */
  gradient: string;
  /** Short emoji-like glyph (kept simple so no asset is needed). */
  glyph: string;
}

export const PLATFORM_STYLE: Record<Platform, PlatformStyle> = {
  '': {
    pill: '',
    pillLg: '',
    gradient: '',
    glyph: '',
  },
  Nanobanana: {
    pill:
      'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    pillLg:
      'text-emerald-300 border-emerald-400/40 bg-emerald-500/15',
    gradient: 'linear-gradient(135deg, #10b981, #047857)',
    glyph: 'NB',
  },
  Chatgpt: {
    pill: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    pillLg: 'text-blue-300 border-blue-400/40 bg-blue-500/15',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    glyph: 'GP',
  },
  Study: {
    pill:
      'text-amber-400 border-amber-500/30 bg-amber-500/10',
    pillLg:
      'text-amber-300 border-amber-400/40 bg-amber-500/15',
    gradient: 'linear-gradient(135deg, #f59e0b, #b45309)',
    glyph: 'ST',
  },
};

/** Lookup helper — falls back to a neutral style for unknown platforms. */
export function getPlatformStyle(platform: string): PlatformStyle {
  if (platform in PLATFORM_STYLE) {
    return PLATFORM_STYLE[platform as Platform];
  }
  return {
    pill: 'text-surface-300 border-surface-600 bg-surface-800',
    pillLg: 'text-surface-200 border-surface-500 bg-surface-700',
    gradient: 'linear-gradient(135deg, #52525b, #27272a)',
    glyph: '?',
  };
}
