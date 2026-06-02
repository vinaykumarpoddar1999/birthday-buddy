import { create } from 'zustand';

import type {
  AuthSession,
  AuthState,
  AuthUser,
  LoginInput,
  SecurityPreferences,
  SignUpInput,
  TrustedDevice,
} from '@features/auth/types/auth.types';
import { authService } from '@/services/auth/auth.service';
import { sessionService } from '@/services/auth/session.service';
import { appLockService } from '@/services/auth/app-lock.service';
import { secureAuthStorage } from '@/services/auth/secure-auth-storage';
import { userRepository } from '@/repositories/user.repository';
import { loginHistoryRepository } from '@/repositories/login-history.repository';
import { deviceRegistryRepository } from '@/repositories/device-registry.repository';
import { useProfileStore } from '@features/profile/store/profile.store';
import { profileService, DEFAULT_USER_PROFILE } from '@/services/profile/profile.service';

async function syncProfileFromAuthUser(user: AuthUser): Promise<void> {
  const bundle = await profileService.load();
  useProfileStore.setState({
    profile: {
      ...bundle.profile,
      fullName: user.fullName,
      email: user.email ?? '',
      phone: user.phone ?? '',
      birthday: user.dateOfBirth,
      gender: (user.gender as 'male' | 'female' | 'other') ?? 'other',
      location: user.country,
      profileImage: user.profilePhoto,
      preferences: user.nickname,
    },
  });
  await profileService.saveBundle({
    ...bundle,
    profile: {
      ...bundle.profile,
      fullName: user.fullName,
      email: user.email ?? '',
      phone: user.phone ?? '',
      birthday: user.dateOfBirth,
      gender: (user.gender as 'male' | 'female' | 'other') ?? 'other',
      location: user.country,
      profileImage: user.profilePhoto,
      preferences: user.nickname,
    },
  });
}

function resetProfileToGuest(): void {
  const guestProfile = { ...DEFAULT_USER_PROFILE, joinedAt: new Date().toISOString() };
  useProfileStore.setState({
    profile: guestProfile,
    profileCompletion: 0,
  });
  void profileService.saveBundle({
    profile: guestProfile,
    language: useProfileStore.getState().language,
    currency: useProfileStore.getState().currency,
    theme: useProfileStore.getState().theme,
    appIcon: useProfileStore.getState().appIcon,
    hapticFeedback: useProfileStore.getState().hapticFeedback,
    notificationPrefs: useProfileStore.getState().notificationPrefs,
    reminderSettings: useProfileStore.getState().reminderSettings,
    privacySettings: useProfileStore.getState().privacySettings,
    backupSettings: useProfileStore.getState().backupSettings,
    appearanceSettings: useProfileStore.getState().appearanceSettings,
    calendarSync: useProfileStore.getState().calendarSync,
    appRating: useProfileStore.getState().appRating,
  }).catch(() => undefined);
}

type AuthStoreState = {
  user: AuthUser | null;
  session: AuthSession | null;
  securityPreferences: SecurityPreferences | null;
  authState: AuthState;
  isHydrated: boolean;
  isLocked: boolean;
  onboardingComplete: boolean;
  hasAccount: boolean;
  loginHistory: ReturnType<typeof loginHistoryRepository.getRecent> extends Promise<infer T> ? T : never;
  trustedDevices: TrustedDevice[];
  isLoading: boolean;
  recoveryCode: string | null;

  hydrate: () => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signIn: (input: LoginInput) => Promise<void>;
  signOut: () => Promise<void>;
  unlock: (input: LoginInput) => Promise<boolean>;
  completeOnboarding: () => Promise<void>;
  enterGuestMode: () => Promise<void>;
  updateSecurityPreferences: (updates: Partial<SecurityPreferences>) => Promise<void>;
  setupPin: (pin: string, length: 4 | 6) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setLocked: (locked: boolean) => void;
  recordActivity: () => void;
  loadSecurityData: () => Promise<void>;
};

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  session: null,
  securityPreferences: null,
  authState: 'unknown',
  isHydrated: false,
  isLocked: false,
  onboardingComplete: false,
  hasAccount: false,
  loginHistory: [],
  trustedDevices: [],
  isLoading: false,
  recoveryCode: null,

  hydrate: async () => {
    try {
      const hasAccount = await authService.hasAccount();
      let onboardingComplete = (await secureAuthStorage.isOnboardingComplete()) || hasAccount;

      if (!onboardingComplete && !hasAccount) {
        const legacyUser = await userRepository.getActiveUser().catch(() => null);
        if (!legacyUser) {
          const { profileService } = await import('@/services/profile/profile.service');
          const bundle = await profileService.load().catch(() => null);
          if (bundle?.profile?.fullName) {
            onboardingComplete = true;
            await secureAuthStorage.setOnboardingComplete(true);
          }
        }
      }
      let { valid, userId, session } = await sessionService.validateSession();

      if (!hasAccount) {
        const isGuest = await secureAuthStorage.isGuestMode();
        set({
          user: null,
          session: null,
          securityPreferences: null,
          authState: isGuest ? 'guest' : onboardingComplete ? 'unauthenticated' : 'setup_required',
          isHydrated: true,
          isLocked: false,
          onboardingComplete,
          hasAccount: false,
        });
        return;
      }

      if (!valid || !userId) {
        const storedUserId = await secureAuthStorage.getSessionUserId();
        let recoverUserId = storedUserId;
        if (!recoverUserId) {
          const activeUser = await userRepository.getActiveUser().catch(() => null);
          recoverUserId = activeUser?.id ?? null;
        }
        if (recoverUserId) {
          const recovered = await sessionService.recoverSession(recoverUserId);
          if (recovered) {
            valid = true;
            userId = recoverUserId;
            session = recovered;
          }
        }
      }

      if (!valid || !userId) {
        const pendingUser = await userRepository.findByUuid(
          (await secureAuthStorage.getSessionUserId()) ?? '',
        ).catch(() => null);
        set({
          user: pendingUser,
          session: null,
          securityPreferences: null,
          authState: 'session_recovery',
          isHydrated: true,
          isLocked: false,
          onboardingComplete: true,
          hasAccount: true,
        });
        return;
      }

      const user = await userRepository.findByUuid(userId);
      const prefs = await authService.getSecurityPreferences(userId);
      const shouldLock = appLockService.shouldLockOnStart(prefs);

      if (shouldLock) {
        appLockService.lock();
      }

      set({
        user,
        session,
        securityPreferences: prefs,
        authState: shouldLock ? 'locked' : 'authenticated',
        isHydrated: true,
        isLocked: shouldLock,
        onboardingComplete: true,
        hasAccount: true,
      });

      if (user) {
        await get().loadSecurityData();
      }
    } catch {
      set({
        authState: 'unauthenticated',
        isHydrated: true,
        isLocked: false,
      });
    }
  },

  signUp: async (input) => {
    set({ isLoading: true });
    try {
      const { user, recoveryCode } = await authService.signUp(input);
      const prefs = await authService.getSecurityPreferences(user.id);
      await secureAuthStorage.setOnboardingComplete(true);
      await secureAuthStorage.setGuestMode(false);
      await syncProfileFromAuthUser(user);
      set({
        user,
        securityPreferences: prefs,
        authState: 'authenticated',
        isLocked: false,
        onboardingComplete: true,
        hasAccount: true,
        recoveryCode,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signIn: async (input) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(input);
      const prefs = await authService.getSecurityPreferences(user.id);
      appLockService.unlock();
      await secureAuthStorage.setGuestMode(false);
      await syncProfileFromAuthUser(user);
      set({
        user,
        securityPreferences: prefs,
        authState: 'authenticated',
        isLocked: false,
        hasAccount: true,
        onboardingComplete: true,
        isLoading: false,
      });
      await get().loadSecurityData();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    await authService.logout();
    appLockService.unlock();
    resetProfileToGuest();
    await secureAuthStorage.setGuestMode(true);
    set({
      user: null,
      session: null,
      securityPreferences: null,
      authState: 'guest',
      isLocked: false,
      loginHistory: [],
      trustedDevices: [],
    });
  },

  unlock: async (input) => {
    try {
      const user = get().user;
      if (!user) {
        await get().signIn(input);
        return true;
      }
      await authService.login({ ...input, identifier: user.email ?? user.phone ?? '' });
      appLockService.unlock();
      set({ authState: 'authenticated', isLocked: false });
      return true;
    } catch {
      return false;
    }
  },

  completeOnboarding: async () => {
    await secureAuthStorage.setOnboardingComplete(true);
    set({ onboardingComplete: true, authState: 'unauthenticated' });
  },

  enterGuestMode: async () => {
    await secureAuthStorage.setOnboardingComplete(true);
    await secureAuthStorage.setGuestMode(true);
    resetProfileToGuest();
    set({ onboardingComplete: true, authState: 'guest', user: null, session: null });
  },

  updateSecurityPreferences: async (updates) => {
    const user = get().user;
    if (!user) return;
    await authService.updateSecurityPreferences(user.id, updates);
    const prefs = await authService.getSecurityPreferences(user.id);
    set({ securityPreferences: prefs });
  },

  setupPin: async (pin, length) => {
    const user = get().user;
    if (!user) return;
    await authService.setupPin(user.id, pin, length);
    const prefs = await authService.getSecurityPreferences(user.id);
    set({ securityPreferences: prefs });
  },

  changePassword: async (current, next) => {
    const user = get().user;
    if (!user) return;
    await authService.changePassword(user.id, current, next);
  },

  deleteAccount: async () => {
    const user = get().user;
    if (user) {
      await authService.deleteAccount(user.id);
    } else {
      await authService.wipeAllAuthData();
    }
    set({
      user: null,
      session: null,
      securityPreferences: null,
      authState: 'setup_required',
      isLocked: false,
      hasAccount: false,
      onboardingComplete: false,
    });
  },

  refreshSession: async () => {
    await sessionService.refreshSession();
  },

  setLocked: (locked) => {
    if (locked) appLockService.lock();
    else appLockService.unlock();
    set({ isLocked: locked, authState: locked ? 'locked' : 'authenticated' });
  },

  recordActivity: () => {
    appLockService.recordActivity();
    void get().refreshSession();
  },

  loadSecurityData: async () => {
    const user = get().user;
    if (!user) return;
    const [history, devices] = await Promise.all([
      loginHistoryRepository.getRecent(user.id),
      deviceRegistryRepository.getTrustedDevices(user.id),
    ]);
    set({ loginHistory: history, trustedDevices: devices });
  },
}));
