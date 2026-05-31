import { type Href, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuthStore } from '@store/auth.store';

export function useAuthRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)' as Href);
    }
  }, [isAuthenticated, isHydrated, segments, router]);
}
