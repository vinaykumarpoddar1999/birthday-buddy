import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';
import type { Contact, CreateContactInput, UpdateContactInput } from '../types';

export async function fetchContacts(userId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) throw handleApiError(error);
  return data ?? [];
}

export async function createContact(input: CreateContactInput): Promise<Contact> {
  const { data, error } = await supabase.from('contacts').insert(input).select().single();
  if (error) throw handleApiError(error);
  return data;
}

export async function updateContact({ id, ...patch }: UpdateContactInput): Promise<Contact> {
  const { data, error } = await supabase.from('contacts').update(patch).eq('id', id).select().single();
  if (error) throw handleApiError(error);
  return data;
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw handleApiError(error);
}
