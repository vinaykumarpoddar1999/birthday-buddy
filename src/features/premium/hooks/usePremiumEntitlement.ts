import { useEffect } from 'react';

import { usePremiumStore } from '@/stores/premium.store';
import { useProfileStore } from '@features/profile/store/profile.store';

export function usePremiumEntitlement() {
  const hydrated = usePremiumStore((s) => s.hydrated);
  const isPremium = usePremiumStore((s) => s.isPremium);
  const hydrate = usePremiumStore((s) => s.hydrate);
  const profilePremium = useProfileStore((s) => s.profile.isPremium);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  return {
    isActive: isPremium || profilePremium,
    hydrated,
  };
}
