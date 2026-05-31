import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';
import type { PurchaseRecord, Subscription, SubscriptionPlan } from '../types';

export async function fetchSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) throw handleApiError(error);
  return data;
}

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase.from('subscription_plans').select('*');
  if (error) throw handleApiError(error);
  return data ?? [];
}

export async function recordPurchase(
  input: Omit<PurchaseRecord, 'id' | 'purchased_at'>,
): Promise<PurchaseRecord> {
  const { data, error } = await supabase.from('purchase_history').insert(input).select().single();
  if (error) throw handleApiError(error);
  return data;
}

// Wire Google Play Billing / Apple IAP in native modules — stub for Phase 1
export async function purchasePremiumPlan(_productId: string): Promise<{ success: boolean }> {
  return { success: false };
}
