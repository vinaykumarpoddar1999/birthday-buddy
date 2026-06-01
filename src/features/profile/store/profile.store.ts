import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  AppCurrency,
  AppIconOption,
  AppLanguage,
  BackupSettings,
  NotificationPreferences,
  PrivacySettings,
  ReminderSettings,
  UserProfile,
} from '../types';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  fullName: 'Ananya Mehta',
  email: 'ananya.mehta@gmail.com',
  phone: '+91 98765 43210',
  gender: 'female',
  birthday: '1998-03-15',
  location: 'Mumbai, India',
  bio: 'Making every birthday special!',
  profileImage: null,
  isPremium: true,
  streak: 12,
  joinedAt: '2025-01-15T00:00:00.000Z',
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  pushNotifications: true,
  birthdayAlerts: true,
  wishSuggestions: true,
  specialEventAlerts: true,
  systemNotifications: true,
};

const DEFAULT_REMINDER: ReminderSettings = {
  defaultTime: '08:00',
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  birthdayAlarm: true,
};

const DEFAULT_PRIVACY: PrivacySettings = {
  faceId: false,
  biometricLock: false,
  appLock: false,
  hidePersonalData: false,
};

const DEFAULT_BACKUP: BackupSettings = {
  cloudBackup: true,
  localBackup: false,
  lastBackupDate: '2026-05-28T10:30:00.000Z',
  backupStatus: 'idle',
};

interface ProfileStoreState {
  profile: UserProfile;
  language: AppLanguage;
  currency: AppCurrency;
  theme: 'light' | 'dark' | 'system';
  appIcon: AppIconOption;
  hapticFeedback: boolean;
  notificationPrefs: NotificationPreferences;
  reminderSettings: ReminderSettings;
  privacySettings: PrivacySettings;
  backupSettings: BackupSettings;
  appRating: number | null;
  profileCompletion: number;

  updateProfile: (updates: Partial<UserProfile>) => void;
  setLanguage: (lang: AppLanguage) => void;
  setCurrency: (currency: AppCurrency) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAppIcon: (icon: AppIconOption) => void;
  setHapticFeedback: (enabled: boolean) => void;
  updateNotificationPrefs: (updates: Partial<NotificationPreferences>) => void;
  updateReminderSettings: (updates: Partial<ReminderSettings>) => void;
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => void;
  updateBackupSettings: (updates: Partial<BackupSettings>) => void;
  setAppRating: (rating: number) => void;
  deleteAccount: () => void;
  resetStore: () => void;
}

const calcProfileCompletion = (profile: UserProfile): number => {
  const fields = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.gender,
    profile.birthday,
    profile.location,
    profile.bio,
    profile.profileImage,
  ];
  const filled = fields.filter((f) => f && f.length > 0).length;
  return Math.round((filled / fields.length) * 100);
};

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      language: 'english',
      currency: 'INR',
      theme: 'system',
      appIcon: 'classic',
      hapticFeedback: true,
      notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
      reminderSettings: DEFAULT_REMINDER,
      privacySettings: DEFAULT_PRIVACY,
      backupSettings: DEFAULT_BACKUP,
      appRating: null,
      profileCompletion: calcProfileCompletion(DEFAULT_PROFILE),

      updateProfile: (updates) =>
        set((s) => {
          const updated = { ...s.profile, ...updates };
          return { profile: updated, profileCompletion: calcProfileCompletion(updated) };
        }),

      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      setAppIcon: (appIcon) => set({ appIcon }),
      setHapticFeedback: (hapticFeedback) => set({ hapticFeedback }),

      updateNotificationPrefs: (updates) =>
        set((s) => ({ notificationPrefs: { ...s.notificationPrefs, ...updates } })),

      updateReminderSettings: (updates) =>
        set((s) => ({ reminderSettings: { ...s.reminderSettings, ...updates } })),

      updatePrivacySettings: (updates) =>
        set((s) => ({ privacySettings: { ...s.privacySettings, ...updates } })),

      updateBackupSettings: (updates) =>
        set((s) => ({ backupSettings: { ...s.backupSettings, ...updates } })),

      setAppRating: (appRating) => set({ appRating }),

      deleteAccount: () =>
        set({
          profile: { ...DEFAULT_PROFILE, fullName: '', email: '', phone: '', bio: '', profileImage: null },
          notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
          reminderSettings: DEFAULT_REMINDER,
          privacySettings: DEFAULT_PRIVACY,
          backupSettings: DEFAULT_BACKUP,
          appRating: null,
          profileCompletion: 0,
        }),

      resetStore: () =>
        set({
          profile: DEFAULT_PROFILE,
          language: 'english',
          currency: 'INR',
          theme: 'system',
          appIcon: 'classic',
          hapticFeedback: true,
          notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
          reminderSettings: DEFAULT_REMINDER,
          privacySettings: DEFAULT_PRIVACY,
          backupSettings: DEFAULT_BACKUP,
          appRating: null,
          profileCompletion: calcProfileCompletion(DEFAULT_PROFILE),
        }),
    }),
    {
      name: 'birthday-buddy-profile-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
