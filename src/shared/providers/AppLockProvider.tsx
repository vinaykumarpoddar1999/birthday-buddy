import { type ReactNode, useEffect, useMemo } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import type { SecurityPreferences } from '@features/auth/types/auth.types';
import { useProfileStore } from '@features/profile/store/profile.store';
import { DEFAULT_SECURITY_PREFERENCES } from '@/repositories/security-preferences.repository';
import { useAuthStore } from '@/stores/auth.store';
import { appLockService } from '@/services/auth/app-lock.service';

type AppLockProviderProps = {
  children: ReactNode;
};

function buildGuestLockPrefs(enabled: boolean): SecurityPreferences {
  return {
    ...DEFAULT_SECURITY_PREFERENCES,
    appLockEnabled: enabled,
    devicePasscodeEnabled: enabled,
    biometricEnabled: enabled,
    lockOnBackground: enabled,
    lockOnRestart: enabled,
    lockAfterInactivity: enabled,
    autoLockTimer: 'immediate',
  };
}

export function AppLockProvider({ children }: AppLockProviderProps) {
  const securityPreferences = useAuthStore((s) => s.securityPreferences);
  const authState = useAuthStore((s) => s.authState);
  const setLocked = useAuthStore((s) => s.setLocked);
  const recordActivity = useAuthStore((s) => s.recordActivity);
  const guestSystemLock = useProfileStore((s) => s.privacySettings.systemLockEnabled);

  const effectivePrefs = useMemo(() => {
    if (authState === 'authenticated' && securityPreferences) {
      return securityPreferences;
    }
    if (authState === 'guest' && guestSystemLock) {
      return buildGuestLockPrefs(true);
    }
    return null;
  }, [authState, guestSystemLock, securityPreferences]);

  useEffect(() => {
    if (!effectivePrefs?.appLockEnabled) return;
    if (authState === 'setup_required' || authState === 'unauthenticated') return;
    if (authState === 'locked') return;

    if (appLockService.consumeStartupLock(effectivePrefs)) {
      setLocked(true);
    }

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        appLockService.onBackground(effectivePrefs);
        const state = appLockService.getState();
        if (state.isLocked) setLocked(true);
      } else if (nextState === 'active') {
        const shouldLock = appLockService.onForeground(effectivePrefs);
        if (shouldLock) setLocked(true);
        else recordActivity();
      }
    });

    const interval = setInterval(() => {
      if (appLockService.checkInactivity(effectivePrefs)) {
        setLocked(true);
      }
    }, 30_000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [authState, effectivePrefs, setLocked, recordActivity]);

  return <>{children}</>;
};
