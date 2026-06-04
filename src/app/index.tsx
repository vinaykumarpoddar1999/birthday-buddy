import { Redirect, useRootNavigationState } from 'expo-router';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth.store';

export default function Index() {
  const authState = useAuthStore((s) => s.authState);
  const rootNavigation = useRootNavigationState();

  if (!rootNavigation?.key) {
    return null;
  }

  switch (authState) {
    case 'setup_required':
      return <Redirect href={ROUTES.onboarding} />;
    case 'unauthenticated':
      return <Redirect href={ROUTES.welcome} />;
    case 'session_recovery':
      return <Redirect href="/(auth)/session-recovery" />;
    case 'locked':
      return <Redirect href={ROUTES.lock} />;
    case 'guest':
    case 'authenticated':
    default:
      return <Redirect href={ROUTES.home} />;
  }
}
