import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@store/auth.store';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import { fetchPlans, fetchSubscription, purchasePremiumPlan, recordPurchase } from '../api/premium.api';

export function usePremium() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryKey: userId ? queryKeys.subscription(userId) : queryKeys.premium,
    queryFn: () => fetchSubscription(userId!),
    enabled: Boolean(userId),
  });

  const plansQuery = useQuery({
    queryKey: [...queryKeys.premium, 'plans'],
    queryFn: fetchPlans,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (productId: string) => {
      const result = await purchasePremiumPlan(productId);
      if (result.success && userId) {
        await recordPurchase({
          user_id: userId,
          product_id: productId,
          platform: 'expo-stub',
        });
        analytics.track(ANALYTICS_EVENTS.PREMIUM_PURCHASED, { productId });
      }
      return result;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.subscription(userId) });
      }
    },
  });

  const isPremium = subscriptionQuery.data?.status === 'active';

  return {
    subscription: subscriptionQuery.data,
    plans: plansQuery.data ?? [],
    isPremium,
    isLoading: subscriptionQuery.isLoading,
    purchasePlan: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
}
