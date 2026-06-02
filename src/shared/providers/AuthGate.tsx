import { Redirect, useSegments } from 'expo-router';
import { type ReactNode, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useAuthStore } from '@/stores/auth.store';

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const authState = useAuthStore((s) => s.authState);
  const hydrate = useAuthStore((s) => s.hydrate);
  const segments = useSegments();

  useEffect(() => {
    if (!isHydrated) void hydrate();
  }, [isHydrated, hydrate]);

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const inAuthGroup = segments[0] === '(auth)';
  const isLocked = authState === 'locked';

  if (authState === 'setup_required' && !inAuthGroup) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (authState === 'unauthenticated' && !inAuthGroup) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (authState === 'guest' && inAuthGroup) {
    const currentRoute = segments[1] as string | undefined;
    const guestAllowedRoutes = ['welcome', 'login', 'register', 'forgot-password', 'onboarding'];
    if (currentRoute && !guestAllowedRoutes.includes(currentRoute)) {
      return <Redirect href="/(tabs)" />;
    }
  }

  if (authState === 'session_recovery' && segments[1] !== 'session-recovery') {
    const recoveryBypassRoutes = ['login', 'register', 'forgot-password', 'welcome'];
    const currentRoute = segments[1] as string | undefined;
    if (!currentRoute || !recoveryBypassRoutes.includes(currentRoute)) {
      return <Redirect href="/(auth)/session-recovery" />;
    }
  }

  if (isLocked && segments[1] !== 'lock') {
    return <Redirect href="/(auth)/lock" />;
  }

  if ((authState === 'authenticated') && inAuthGroup && segments[1] !== 'lock') {
    const allowedAuthRoutes = ['lock', 'pin-setup', 'biometric-setup', 'permissions', 'security-preferences'];
    const currentRoute = segments[1] as string | undefined;
    if (!currentRoute || !allowedAuthRoutes.includes(currentRoute)) {
      return <Redirect href="/(tabs)" />;
    }
  }

  return <>{children}</>;
}
