import { useCallback } from 'react';
import { router } from 'expo-router';

import { usePremiumEntitlement } from './usePremiumEntitlement';

export function usePremiumGate(_featureKey?: string) {
  const { isActive } = usePremiumEntitlement();

  const requirePremium = useCallback(
    (onAllowed: () => void) => {
      if (isActive) {
        onAllowed();
        return;
      }
      router.push('/premium-upgrade');
    },
    [isActive],
  );

  return { isActive, requirePremium };
}
