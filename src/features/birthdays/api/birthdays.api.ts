import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';
import type { Birthday, CreateBirthdayInput } from '../types';

export async function fetchBirthdays(): Promise<Birthday[]> {
  const { data, error } = await supabase.from('birthdays').select('*').order('birth_date');
  if (error) throw handleApiError(error);
  return data ?? [];
}

export async function createBirthday(input: CreateBirthdayInput): Promise<Birthday> {
  const { data, error } = await supabase.from('birthdays').insert(input).select().single();
  if (error) throw handleApiError(error);
  return data;
}

export async function deleteBirthday(id: string): Promise<void> {
  const { error } = await supabase.from('birthdays').delete().eq('id', id);
  if (error) throw handleApiError(error);
}
