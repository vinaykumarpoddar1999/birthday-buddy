import { create } from 'zustand';

import type { AuthState } from '@features/auth/types/auth.types';
import { isOnboardingComplete, setOnboardingComplete } from '@/lib/onboarding-storage';
import { profileService } from '@/services/profile/profile.service';

type AuthStoreState = {
  authState: AuthState;
  isHydrated: boolean;
  onboardingComplete: boolean;
  hydrate: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  authState: 'setup_required',
  isHydrated: false,
  onboardingComplete: false,

  hydrate: async () => {
    try {
      let onboardingComplete = await isOnboardingComplete();

      if (!onboardingComplete) {
        const bundle = await profileService.load().catch(() => null);
        if (bundle?.profile?.fullName) {
          onboardingComplete = true;
          await setOnboardingComplete(true);
        }
      }

      set({
        onboardingComplete,
        authState: onboardingComplete ? 'guest' : 'setup_required',
        isHydrated: true,
      });
    } catch {
      set({
        authState: 'setup_required',
        isHydrated: true,
        onboardingComplete: false,
      });
    }
  },

  completeOnboarding: async () => {
    await setOnboardingComplete(true);
    set({ onboardingComplete: true, authState: 'guest' });
  },

  enterGuestMode: async () => {
    await setOnboardingComplete(true);
    set({ onboardingComplete: true, authState: 'guest' });
  },
}));
