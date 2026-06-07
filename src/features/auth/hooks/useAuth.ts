import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const authState = useAuthStore((s) => s.authState);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const enterGuestMode = useAuthStore((s) => s.enterGuestMode);

  return {
    authState,
    isHydrated,
    onboardingComplete,
    completeOnboarding,
    enterGuestMode,
  };
}
