import { Redirect, useRootNavigationState } from 'expo-router';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth.store';

export default function Index() {
  const authState = useAuthStore((s) => s.authState);
  const rootNavigation = useRootNavigationState();

  if (!rootNavigation?.key) {
    return null;
  }

  if (authState === 'setup_required') {
    return <Redirect href={ROUTES.onboarding} />;
  }

  return <Redirect href={ROUTES.home} />;
}
