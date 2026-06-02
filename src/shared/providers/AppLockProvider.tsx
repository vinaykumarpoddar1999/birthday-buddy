import { type ReactNode, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useAuthStore } from '@/stores/auth.store';
import { appLockService } from '@/services/auth/app-lock.service';

type AppLockProviderProps = {
  children: ReactNode;
};

export function AppLockProvider({ children }: AppLockProviderProps) {
  const securityPreferences = useAuthStore((s) => s.securityPreferences);
  const authState = useAuthStore((s) => s.authState);
  const setLocked = useAuthStore((s) => s.setLocked);
  const recordActivity = useAuthStore((s) => s.recordActivity);

  useEffect(() => {
    if (authState !== 'authenticated' || !securityPreferences) return;

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        appLockService.onBackground(securityPreferences);
        const state = appLockService.getState();
        if (state.isLocked) setLocked(true);
      } else if (nextState === 'active') {
        const shouldLock = appLockService.onForeground(securityPreferences);
        if (shouldLock) setLocked(true);
        else recordActivity();
      }
    });

    const interval = setInterval(() => {
      if (appLockService.checkInactivity(securityPreferences)) {
        setLocked(true);
      }
    }, 30_000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [authState, securityPreferences, setLocked, recordActivity]);

  return <>{children}</>;
}
