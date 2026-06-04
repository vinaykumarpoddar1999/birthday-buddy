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
  const isLocked = authState === 'locked';
  const currentRoute = segments[1] as string | undefined;

  if (!isLocked && inAuthGroup && currentRoute === 'lock') {
    return <Redirect href={ROUTES.home} />;
  }

  if (authState === 'setup_required' && !inAuthGroup) {
    return <Redirect href={ROUTES.onboarding} />;
  }

  if (authState === 'unauthenticated' && !inAuthGroup) {
    return <Redirect href={ROUTES.welcome} />;
  }

  if (isLocked && currentRoute !== 'lock') {
    return <Redirect href={ROUTES.lock} />;
  }

  if (authState === 'guest' && inAuthGroup) {
    const guestAllowedRoutes = ['welcome', 'login', 'register', 'forgot-password', 'onboarding'];
    if (!isLocked && currentRoute && !guestAllowedRoutes.includes(currentRoute)) {
      return <Redirect href={ROUTES.home} />;
    }
  }

  if (authState === 'session_recovery' && currentRoute !== 'session-recovery') {
    const recoveryBypassRoutes = ['login', 'register', 'forgot-password', 'welcome'];
    if (!currentRoute || !recoveryBypassRoutes.includes(currentRoute)) {
      return <Redirect href="/(auth)/session-recovery" />;
    }
  }

  if (authState === 'authenticated' && inAuthGroup) {
    const allowedAuthRoutes = ['lock', 'pin-setup', 'biometric-setup', 'permissions', 'security-preferences'];
    if (!isLocked && currentRoute && !allowedAuthRoutes.includes(currentRoute)) {
      return <Redirect href={ROUTES.home} />;
    }
  }

  return <>{children}</>;
};
