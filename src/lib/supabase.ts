import { createClient } from '@supabase/supabase-js';
import type { Prompt } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchPrompts(): Promise<Prompt[]> {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addPrompt(prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'use_count'> & { is_favorite?: boolean }): Promise<Prompt> {
  const { data, error } = await supabase
    .from('prompts')
    .insert({
      ...prompt,
      is_favorite: prompt.is_favorite ?? false,
      use_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
  const { data, error } = await supabase
    .from('prompts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePrompt(id: string): Promise<void> {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function incrementUseCount(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_use_count', { prompt_id: id });
  if (error) throw error;
}
