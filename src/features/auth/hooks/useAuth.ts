import { useCallback, useState } from 'react';

import type { LoginInput, SignUpInput } from '@features/auth/types/auth.types';
import { AuthError } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const authState = useAuthStore((s) => s.authState);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isLocked = useAuthStore((s) => s.isLocked);
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);
  const hasAccount = useAuthStore((s) => s.hasAccount);
  const securityPreferences = useAuthStore((s) => s.securityPreferences);
  const isLoading = useAuthStore((s) => s.isLoading);
  const recoveryCode = useAuthStore((s) => s.recoveryCode);
  const loginHistory = useAuthStore((s) => s.loginHistory);
  const trustedDevices = useAuthStore((s) => s.trustedDevices);

  const signUp = useAuthStore((s) => s.signUp);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);
  const unlock = useAuthStore((s) => s.unlock);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const enterGuestMode = useAuthStore((s) => s.enterGuestMode);
  const updateSecurityPreferences = useAuthStore((s) => s.updateSecurityPreferences);
  const setupPin = useAuthStore((s) => s.setupPin);
  const changePassword = useAuthStore((s) => s.changePassword);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const recordActivity = useAuthStore((s) => s.recordActivity);
  const setLocked = useAuthStore((s) => s.setLocked);
  const loadSecurityData = useAuthStore((s) => s.loadSecurityData);

  const isAuthenticated = authState === 'authenticated';
  const isGuest = authState === 'guest';

  const [error, setError] = useState<string | null>(null);

  const handleSignUp = useCallback(
    async (input: SignUpInput) => {
      setError(null);
      try {
        await signUp(input);
      } catch (err) {
        const message =
          err instanceof AuthError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Sign up failed';
        setError(message);
        throw err;
      }
    },
    [signUp],
  );

  const handleSignIn = useCallback(
    async (input: LoginInput) => {
      setError(null);
      try {
        await signIn(input);
      } catch (err) {
        const message =
          err instanceof AuthError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Sign in failed';
        setError(message);
        throw err;
      }
    },
    [signIn],
  );

  const handleSignOut = useCallback(async () => {
    setError(null);
    await signOut();
  }, [signOut]);

  return {
    user,
    isAuthenticated,
    isGuest,
    isHydrated,
    isLocked,
    authState,
    onboardingComplete,
    hasAccount,
    securityPreferences,
    isLoading,
    isSigningIn: isLoading,
    isSigningUp: isLoading,
    recoveryCode,
    loginHistory,
    trustedDevices,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    unlock,
    completeOnboarding,
    enterGuestMode,
    updateSecurityPreferences,
    setupPin,
    changePassword,
    deleteAccount,
    recordActivity,
    setLocked,
    loadSecurityData,
  };
}
