import { create } from 'zustand';
import type { Prompt, PromptInput, TabId, SortOption } from '../types';
import {
  fetchPrompts,
  addPrompt as apiAddPrompt,
  updatePrompt as apiUpdatePrompt,
  deletePrompt as apiDeletePrompt,
  incrementUseCount,
} from '../lib/supabase';
import { cachePrompts, getCachedPrompts, addPendingSync } from '../lib/offline-db';

// Type-only import for Fuse to avoid pulling fuse.js into the main bundle.
// The real module is dynamically imported on first use.
import type Fuse from 'fuse.js';

interface PromptStore {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  activeTab: TabId;
  selectedPrompt: Prompt | null;
  searchQuery: string;
  filterPlatform: string;
  filterTag: string;
  sortBy: SortOption;
  recentlyUsed: Prompt[];
  shareText: string | null;

  setActiveTab: (tab: TabId) => void;
  setSelectedPrompt: (prompt: Prompt | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterPlatform: (p: string) => void;
  setFilterTag: (t: string) => void;
  setSortBy: (s: SortOption) => void;
  setShareText: (t: string | null) => void;

  loadPrompts: () => Promise<void>;
  addPrompt: (input: PromptInput) => Promise<void>;
  updatePrompt: (id: string, updates: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  usePrompt: (id: string) => Promise<void>;

  getFilteredPrompts: () => Prompt[];
  getSearchResults: () => Prompt[];
  getFavoritePrompts: () => Prompt[];
  getRecentlyUsed: () => Prompt[];
}

// Lazy Fuse.js — the search engine is only needed when the user actually
// searches. This keeps the initial bundle ~10-15KB smaller.
let fuseInstance: Fuse<Prompt> | null = null;
let fusePromise: Promise<typeof import('fuse.js')> | null = null;
let indexedPromptsRef: Prompt[] | null = null;

async function getFuse(prompts: Prompt[]): Promise<Fuse<Prompt>> {
  // Re-build the index when the underlying list changes reference.
  if (fuseInstance && indexedPromptsRef === prompts) return fuseInstance;

  if (!fusePromise) {
    fusePromise = import('fuse.js');
  }
  const FuseModule = await fusePromise;
  const FuseCtor = FuseModule.default;
  fuseInstance = new FuseCtor(prompts, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'body', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'platform', weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
    // Small list — keep all results & let the ranker sort
    shouldSort: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  indexedPromptsRef = prompts;
  return fuseInstance;
}

const RECENTLY_USED_KEY = 'promptvault_recently_used';
const RECENTLY_USED_MAX = 10;

function loadRecentlyUsed(): Prompt[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_USED_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentlyUsed(prompts: Prompt[]): void {
  try {
    localStorage.setItem(
      RECENTLY_USED_KEY,
      JSON.stringify(prompts.slice(0, RECENTLY_USED_MAX))
    );
  } catch {
    /* quota or private mode — non-fatal */
  }
}

export const usePromptStore = create<PromptStore>((set, get) => ({
  prompts: [],
  loading: false,
  error: null,
  activeTab: 'browse',
  selectedPrompt: null,
  searchQuery: '',
  filterPlatform: '',
  filterTag: '',
  sortBy: 'newest',
  recentlyUsed: loadRecentlyUsed(),
  shareText: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterPlatform: (p) => set({ filterPlatform: p }),
  setFilterTag: (t) => set({ filterTag: t }),
  setSortBy: (s) => set({ sortBy: s }),
  setShareText: (t) => set({ shareText: t }),

  loadPrompts: async () => {
    set({ loading: true, error: null });
    try {
      const prompts = await fetchPrompts();
      set({ prompts, loading: false });
      // Reset Fuse so it re-indexes with the fresh data
      fuseInstance = null;
      indexedPromptsRef = null;
      // Cache in the background — non-blocking
      void cachePrompts(prompts);
    } catch {
      // Offline fallback
      try {
        const cached = await getCachedPrompts();
        if (cached.length > 0) {
          set({
            prompts: cached,
            loading: false,
            error: 'Offline — showing cached data',
          });
        } else {
          set({
            loading: false,
            error: 'Failed to load prompts and no cache available',
          });
        }
      } catch {
        set({ loading: false, error: 'Failed to load prompts' });
      }
    }
  },

  addPrompt: async (input) => {
    try {
      const newPrompt = await apiAddPrompt({
        ...input,
        is_favorite: input.is_favorite ?? false,
      });
      set((s) => ({ prompts: [newPrompt, ...s.prompts] }));
      void cachePrompts(get().prompts);
    } catch {
      // Offline: save locally and queue for sync
      const tempId = crypto.randomUUID();
      const offlinePrompt: Prompt = {
        id: tempId,
        title: input.title,
        body: input.body,
        tags: input.tags,
        platform: input.platform,
        is_favorite: input.is_favorite || false,
        use_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set((s) => ({ prompts: [offlinePrompt, ...s.prompts] }));
      void addPendingSync('create', offlinePrompt);
    }
  },

  updatePrompt: async (id, updates) => {
    try {
      const updated = await apiUpdatePrompt(id, updates);
      set((s) => ({
        prompts: s.prompts.map((p) => (p.id === id ? updated : p)),
        selectedPrompt: s.selectedPrompt?.id === id ? updated : s.selectedPrompt,
      }));
      void cachePrompts(get().prompts);
    } catch {
      set((s) => ({
        prompts: s.prompts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
      void addPendingSync('update', { id, ...updates });
    }
  },

  deletePrompt: async (id) => {
    const prev = get().prompts;
    set((s) => ({
      prompts: s.prompts.filter((p) => p.id !== id),
      selectedPrompt: s.selectedPrompt?.id === id ? null : s.selectedPrompt,
    }));
    try {
      await apiDeletePrompt(id);
      void cachePrompts(get().prompts);
    } catch {
      void addPendingSync('delete', { id });
      // Restore on failure (after queueing for sync)
      set({ prompts: prev });
    }
  },

  toggleFavorite: async (id) => {
    const prompt = get().prompts.find((p) => p.id === id);
    if (!prompt) return;
    await get().updatePrompt(id, { is_favorite: !prompt.is_favorite });
  },

  usePrompt: async (id) => {
    const prompt = get().prompts.find((p) => p.id === id);
    if (!prompt) return;
    const updated = { ...prompt, use_count: prompt.use_count + 1 };
    set((s) => {
      const newRecentlyUsed = [
        updated,
        ...s.recentlyUsed.filter((p) => p.id !== id),
      ].slice(0, RECENTLY_USED_MAX);
      saveRecentlyUsed(newRecentlyUsed);
      return {
        prompts: s.prompts.map((p) => (p.id === id ? updated : p)),
        recentlyUsed: newRecentlyUsed,
      };
    });
    try {
      await incrementUseCount(id);
    } catch {
      void addPendingSync('update', { id, use_count: prompt.use_count + 1 });
    }
  },

  getFilteredPrompts: () => {
    const { prompts, filterPlatform, filterTag, sortBy, searchQuery } = get();
    let filtered = prompts;

    if (filterPlatform) filtered = filtered.filter((p) => p.platform === filterPlatform);
    if (filterTag) filtered = filtered.filter((p) => p.tags.includes(filterTag));

    if (searchQuery.trim()) {
      // Search is async (Fuse is lazy); return the platform/tag-filtered
      // list synchronously and let the SearchPage trigger a Fuse search.
      // We still try the sync path if Fuse is already loaded.
      if (fuseInstance) {
        const results = fuseInstance.search(searchQuery);
        const ids = new Set(results.map((r) => r.item.id));
        filtered = filtered.filter((p) => ids.has(p.id));
      }
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'most-used':
        filtered.sort((a, b) => b.use_count - a.use_count);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  },

  getSearchResults: () => {
    const { prompts, searchQuery } = get();
    if (!searchQuery.trim()) return [];
    if (!fuseInstance) {
      // Kick off Fuse load and return empty results for this tick
      void getFuse(prompts);
      return [];
    }
    return fuseInstance.search(searchQuery).map((r) => r.item);
  },

  getFavoritePrompts: () => {
    return get().prompts.filter((p) => p.is_favorite);
  },

  getRecentlyUsed: () => {
    return get().recentlyUsed;
  },
}));

// Pre-load Fuse when the user opens the search tab, for instant results
export function preloadSearch(): void {
  const { prompts } = usePromptStore.getState();
  if (!fuseInstance) void getFuse(prompts);
}
