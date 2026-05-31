import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';
import type { Referral, ReferralCode, ReferralReward } from '../types';

export async function fetchReferrals(userId: string): Promise<Referral[]> {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer', userId)
    .order('created_at', { ascending: false });

  if (error) throw handleApiError(error);
  return data ?? [];
}

export async function getReferralCode(userId: string): Promise<ReferralCode | null> {
  const { data, error } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw handleApiError(error);
  return data;
}

export async function createReferralCode(userId: string, code: string): Promise<ReferralCode> {
  const { data, error } = await supabase
    .from('referral_codes')
    .insert({ user_id: userId, code })
    .select()
    .single();

  if (error) throw handleApiError(error);
  return data;
}

export async function fetchReferralRewards(userId: string): Promise<ReferralReward[]> {
  const { data, error } = await supabase
    .from('referral_rewards')
    .select('*')
    .eq('user_id', userId);

  if (error) throw handleApiError(error);
  return data ?? [];
}
