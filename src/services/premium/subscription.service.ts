import { addDays, addMonths, addYears } from 'date-fns';

import type { SubscriptionPlanRecord, SubscriptionRecord } from '@features/premium/types';
import { subscriptionRepository } from '@/repositories/subscription.repository';
import { settingsRepository } from '@/repositories/settings.repository';
import { profileService } from '@/services/profile/profile.service';

const PREMIUM_UNTIL_KEY = 'premium_until_iso';

export class SubscriptionService {
  async getPlans(): Promise<SubscriptionPlanRecord[]> {
    return subscriptionRepository.listPlans();
  }

  async getActiveSubscription(): Promise<SubscriptionRecord | null> {
    const sub = await subscriptionRepository.getActiveSubscription();
    if (!sub) return null;

    if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) {
      await subscriptionRepository.expireAllActive();
      await this.syncPremiumFlag(false);
      return null;
    }

    return sub;
  }

  async isPremiumActive(): Promise<boolean> {
    const sub = await this.getActiveSubscription();
    if (sub) return true;

    const until = await settingsRepository.get(PREMIUM_UNTIL_KEY);
    if (until && new Date(until) > new Date()) return true;

    return false;
  }

  private computeExpiry(plan: SubscriptionPlanRecord): string | null {
    const now = new Date();
    if (plan.duration === 'lifetime') return null;
    if (plan.duration === 'yearly') return addYears(now, 1).toISOString();
    return addMonths(now, 1).toISOString();
  }

  async activateLocalPlan(planKey: string): Promise<SubscriptionRecord> {
    const plan = await subscriptionRepository.findPlanByKey(planKey);
    if (!plan) throw new Error('Plan not found');

    await subscriptionRepository.expireAllActive();
    const expiresAt = this.computeExpiry(plan);
    const subId = await subscriptionRepository.insertSubscription(plan.id, 'local', expiresAt);
    await subscriptionRepository.logHistory(plan.id, 'purchase', plan.price, plan.currency);
    await this.syncPremiumFlag(true, expiresAt);

    return {
      id: subId,
      planId: plan.id,
      status: 'active',
      source: 'local',
      startedAt: new Date().toISOString(),
      expiresAt,
    };
  }

  async grantReferralPremium(days: number): Promise<void> {
    const untilIso = await settingsRepository.get(PREMIUM_UNTIL_KEY);
    const base = untilIso && new Date(untilIso) > new Date() ? new Date(untilIso) : new Date();
    const newUntil = addDays(base, days).toISOString();
    await settingsRepository.set(PREMIUM_UNTIL_KEY, newUntil);

    const existing = await subscriptionRepository.getActiveSubscription();
    if (!existing) {
      const yearly = await subscriptionRepository.findPlanByKey('yearly');
      if (yearly) {
        await subscriptionRepository.insertSubscription(yearly.id, 'referral', newUntil);
      }
    }

    await this.syncPremiumFlag(true, newUntil);
  }

  async restorePurchases(): Promise<boolean> {
    const active = await this.getActiveSubscription();
    if (active) {
      await this.syncPremiumFlag(true, active.expiresAt);
      return true;
    }

    const until = await settingsRepository.get(PREMIUM_UNTIL_KEY);
    if (until && new Date(until) > new Date()) {
      await this.syncPremiumFlag(true, until);
      return true;
    }

    return false;
  }

  private async syncPremiumFlag(isPremium: boolean, expiresAt?: string | null): Promise<void> {
    const bundle = await profileService.load();
    await profileService.saveProfile({ ...bundle.profile, isPremium });
    if (expiresAt) {
      await settingsRepository.set(PREMIUM_UNTIL_KEY, expiresAt);
    } else if (!isPremium) {
      await settingsRepository.set(PREMIUM_UNTIL_KEY, '');
    }
  }
}

export const subscriptionService = new SubscriptionService();
