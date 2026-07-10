export interface Prompt {
  id: string;
  title: string;
  body: string;
  tags: string[];
  platform: string;
  is_favorite: boolean;
  use_count: number;
  created_at: string;
  updated_at: string;
}

export interface PromptInput {
  title: string;
  body: string;
  tags: string[];
  platform: string;
  is_favorite?: boolean;
}

export type TabId = 'browse' | 'search' | 'favorites' | 'add';

export type SortOption = 'newest' | 'oldest' | 'most-used' | 'alphabetical';