import { Redirect, useRootNavigationState, useSegments } from 'expo-router';
import { type ReactNode } from 'react';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth.store';

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const authState = useAuthStore((s) => s.authState);
  const segments = useSegments();
  const rootNavigation = useRootNavigationState();

  if (!rootNavigation?.key) {
    return null;
  }

  const inAuthGroup = segments[0] === '(auth)';

  if (authState === 'setup_required' && !inAuthGroup) {
    return <Redirect href={ROUTES.onboarding} />;
  }

  if (authState === 'guest' && inAuthGroup) {
    const currentRoute = segments[1] as string | undefined;
    const allowedRoutes = ['onboarding', 'profile-setup'];
    if (currentRoute && !allowedRoutes.includes(currentRoute)) {
      return <Redirect href={ROUTES.home} />;
    }
  }

  return <>{children}</>;
}
