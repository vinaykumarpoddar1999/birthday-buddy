import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';
import type { Profile, SignInInput, SignUpInput } from '../types';

export async function signInWithEmail(input: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword(input);
  if (error) throw handleApiError(error);
  return data;
}

export async function signUpWithEmail(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { name: input.name },
    },
  });
  if (error) throw handleApiError(error);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw handleApiError(error);
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw handleApiError(error);
  return data;
}

export async function upsertProfile(profile: Partial<Profile> & { id: string; email: string }) {
  const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
  if (error) throw handleApiError(error);
  return data;
}
