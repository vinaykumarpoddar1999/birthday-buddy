import { create } from 'zustand';

import type { SubscriptionPlanRecord, SubscriptionRecord } from '@features/premium/types';
import { subscriptionService } from '@/services/premium/subscription.service';

interface PremiumStoreState {
  plans: SubscriptionPlanRecord[];
  activeSubscription: SubscriptionRecord | null;
  isPremium: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  activatePlan: (planKey: string) => Promise<void>;
  restore: () => Promise<boolean>;
}

export const usePremiumStore = create<PremiumStoreState>()((set) => ({
  plans: [],
  activeSubscription: null,
  isPremium: false,
  hydrated: false,

  hydrate: async () => {
    const [plans, activeSubscription, isPremium] = await Promise.all([
      subscriptionService.getPlans(),
      subscriptionService.getActiveSubscription(),
      subscriptionService.isPremiumActive(),
    ]);
    set({ plans, activeSubscription, isPremium, hydrated: true });
  },

  activatePlan: async (planKey) => {
    const activeSubscription = await subscriptionService.activateLocalPlan(planKey);
    const { useProfileStore } = await import('@features/profile/store/profile.store');
    useProfileStore.getState().updateProfile({ isPremium: true });
    set({ activeSubscription, isPremium: true });
  },

  restore: async () => {
    const restored = await subscriptionService.restorePurchases();
    const isPremium = await subscriptionService.isPremiumActive();
    const activeSubscription = await subscriptionService.getActiveSubscription();
    set({ isPremium, activeSubscription });
    return restored;
  },
}));
