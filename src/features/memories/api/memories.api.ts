import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';
import type { CreateMemoryInput, Memory } from '../types';

export async function fetchMemories(contactId?: string): Promise<Memory[]> {
  let query = supabase.from('memories').select('*').order('created_at', { ascending: false });
  if (contactId) query = query.eq('contact_id', contactId);

  const { data, error } = await query;
  if (error) throw handleApiError(error);
  return data ?? [];
}

export async function createMemory(input: CreateMemoryInput): Promise<Memory> {
  const { data, error } = await supabase.from('memories').insert(input).select().single();
  if (error) throw handleApiError(error);
  return data;
}

export async function deleteMemory(id: string): Promise<void> {
  const { error } = await supabase.from('memories').delete().eq('id', id);
  if (error) throw handleApiError(error);
}
