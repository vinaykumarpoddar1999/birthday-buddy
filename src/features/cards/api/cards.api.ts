import { supabase } from '@/lib/supabase';
import { createCardContent } from '@services/ai';
import { handleApiError } from '@shared/errors';
import type { CreateCardParams, GreetingCard } from '../types';

export async function fetchCards(): Promise<GreetingCard[]> {
  const { data, error } = await supabase.from('cards').select('*').order('created_at', { ascending: false });
  if (error) throw handleApiError(error);
  return data ?? [];
}

export async function createCard(params: CreateCardParams): Promise<GreetingCard> {
  await createCardContent(params);

  const { data, error } = await supabase
    .from('cards')
    .insert({
      contact_id: params.contactId,
      template_id: params.templateId ?? null,
    })
    .select()
    .single();

  if (error) throw handleApiError(error);
  return data;
}
