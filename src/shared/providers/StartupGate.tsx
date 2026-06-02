import * as SplashScreen from 'expo-splash-screen';
import { type ReactNode, useEffect } from 'react';

import { useDatabaseReady } from '@/database/database-provider';
import { useAuthStore } from '@/stores/auth.store';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type StartupGateProps = {
  children: ReactNode;
};

export function StartupGate({ children }: StartupGateProps) {
  const { isReady: isDatabaseReady } = useDatabaseReady();
  const isAuthHydrated = useAuthStore((s) => s.isHydrated);

  const isAppReady = isDatabaseReady && isAuthHydrated;

  useEffect(() => {
    if (isAppReady) {
      void SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isAppReady]);

  return <>{children}</>;
}
