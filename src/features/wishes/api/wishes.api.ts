import { supabase } from '@/lib/supabase';
import { generateWish } from '@services/ai';
import { handleApiError } from '@shared/errors';
import type { GenerateWishParams, Wish } from '../types';

export async function fetchWishes(contactId?: string): Promise<Wish[]> {
  let query = supabase.from('wishes').select('*').order('created_at', { ascending: false });
  if (contactId) query = query.eq('contact_id', contactId);

  const { data, error } = await query;
  if (error) throw handleApiError(error);
  return data ?? [];
}

export async function generateAndSaveWish(params: GenerateWishParams): Promise<Wish> {
  const { text } = await generateWish(params);

  const { data, error } = await supabase
    .from('wishes')
    .insert({
      contact_id: params.contactId,
      generated_text: text,
      tone: params.tone ?? null,
      language: params.language ?? null,
    })
    .select()
    .single();

  if (error) throw handleApiError(error);
  return data;
}
