import { useQuery } from '@tanstack/react-query';

import { usePremiumStore } from '@/stores/premium.store';

export function usePremium() {
  const plans = usePremiumStore((s) => s.plans);
  const subscription = usePremiumStore((s) => s.activeSubscription);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const hydrate = usePremiumStore((s) => s.hydrate);
  const activatePlan = usePremiumStore((s) => s.activatePlan);
  const restore = usePremiumStore((s) => s.restore);

  const { isLoading } = useQuery({
    queryKey: ['premium', 'hydrate'],
    queryFn: async () => {
      await hydrate();
      return true;
    },
    staleTime: 60_000,
  });

  return {
    plans,
    subscription,
    isPremium,
    isLoading,
    subscribe: activatePlan,
    restore,
  };
}
