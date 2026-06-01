import { create } from 'zustand';

import { accountService } from '@/services/account/account.service';
import {
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_BACKUP_SETTINGS,
  DEFAULT_CALENDAR_SYNC,
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_REMINDER_SETTINGS,
  DEFAULT_USER_PROFILE,
  profileService,
} from '@/services/profile/profile.service';
import { reminderService } from '@/services/reminder/reminder.service';
import { useThemeStore } from '@/stores/theme.store';
import type {
  AppearanceSettings,
  AppCurrency,
  AppIconOption,
  AppLanguage,
  BackupSettings,
  CalendarSyncSettings,
  NotificationPreferences,
  PrivacySettings,
  ReminderSettings,
  UserProfile,
} from '../types';

const calcProfileCompletion = (profile: UserProfile): number => {
  const fields = [
    profile.profileImage,
    profile.fullName,
    profile.birthday,
    profile.preferences,
    profile.email,
    profile.phone,
    profile.gender !== 'other' ? profile.gender : '',
    profile.location,
    profile.bio,
  ];
  const filled = fields.filter((f) => f && String(f).length > 0).length;
  return Math.round((filled / fields.length) * 100);
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
  appearanceSettings: AppearanceSettings;
  calendarSync: CalendarSyncSettings;
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
  updateAppearanceSettings: (updates: Partial<AppearanceSettings>) => void;
  updateCalendarSync: (updates: Partial<CalendarSyncSettings>) => void;
  setAppRating: (rating: number) => void;
  deleteAccount: () => Promise<void>;
  resetStore: () => void;
}

function persistState(get: () => ProfileStoreState): void {
  const state = get();
  void profileService.saveBundle({
    profile: state.profile,
    language: state.language,
    currency: state.currency,
    theme: state.theme,
    appIcon: state.appIcon,
    hapticFeedback: state.hapticFeedback,
    notificationPrefs: state.notificationPrefs,
    reminderSettings: state.reminderSettings,
    privacySettings: state.privacySettings,
    backupSettings: state.backupSettings,
    appearanceSettings: state.appearanceSettings,
    calendarSync: state.calendarSync,
    appRating: state.appRating,
  });
}

let rescheduleTimer: ReturnType<typeof setTimeout> | null = null;

function queueReminderReschedule(): void {
  if (rescheduleTimer) clearTimeout(rescheduleTimer);
  rescheduleTimer = setTimeout(() => {
    void reminderService.rescheduleAll();
  }, 400);
}

export const useProfileStore = create<ProfileStoreState>()((set, get) => ({
  profile: DEFAULT_USER_PROFILE,
  language: 'english',
  currency: 'INR',
  theme: 'system',
  appIcon: 'classic',
  hapticFeedback: true,
  notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
  reminderSettings: DEFAULT_REMINDER_SETTINGS,
  privacySettings: DEFAULT_PRIVACY_SETTINGS,
  backupSettings: DEFAULT_BACKUP_SETTINGS,
  appearanceSettings: DEFAULT_APPEARANCE_SETTINGS,
  calendarSync: DEFAULT_CALENDAR_SYNC,
  appRating: null,
  profileCompletion: 0,

  updateProfile: (updates) => {
    set((s) => {
      const profile = { ...s.profile, ...updates };
      return { profile, profileCompletion: calcProfileCompletion(profile) };
    });
    persistState(get);
  },

  setLanguage: (language) => {
    set({ language });
    persistState(get);
  },

  setCurrency: (currency) => {
    set({ currency });
    persistState(get);
  },

  setTheme: (theme) => {
    set((s) => ({
      theme,
      appearanceSettings: { ...s.appearanceSettings, theme },
    }));
    useThemeStore.getState().setMode(theme);
    persistState(get);
  },

  setAppIcon: (appIcon) => {
    set({ appIcon });
    persistState(get);
  },

  setHapticFeedback: (hapticFeedback) => {
    set({ hapticFeedback });
    persistState(get);
  },

  updateNotificationPrefs: (updates) => {
    set((s) => ({ notificationPrefs: { ...s.notificationPrefs, ...updates } }));
    persistState(get);
    queueReminderReschedule();
  },

  updateReminderSettings: (updates) => {
    set((s) => ({ reminderSettings: { ...s.reminderSettings, ...updates } }));
    persistState(get);
    queueReminderReschedule();
  },

  updatePrivacySettings: (updates) => {
    set((s) => ({ privacySettings: { ...s.privacySettings, ...updates } }));
    persistState(get);
  },

  updateBackupSettings: (updates) => {
    set((s) => ({ backupSettings: { ...s.backupSettings, ...updates } }));
    persistState(get);
  },

  updateAppearanceSettings: (updates) => {
    set((s) => {
      const appearanceSettings = { ...s.appearanceSettings, ...updates };
      if (updates.theme) {
        useThemeStore.getState().setMode(updates.theme);
        return { appearanceSettings, theme: updates.theme };
      }
      return { appearanceSettings };
    });
    persistState(get);
  },

  updateCalendarSync: (updates) => {
    set((s) => ({ calendarSync: { ...s.calendarSync, ...updates } }));
    persistState(get);
  },

  setAppRating: (appRating) => {
    set({ appRating });
    persistState(get);
  },

  deleteAccount: () => accountService.wipeLocalData(),

  resetStore: () => {
    void profileService.resetToDefaults().then(() => {
      set({
        profile: DEFAULT_USER_PROFILE,
        language: 'english',
        currency: 'INR',
        theme: 'system',
        appIcon: 'classic',
        hapticFeedback: true,
        notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
        reminderSettings: DEFAULT_REMINDER_SETTINGS,
        privacySettings: DEFAULT_PRIVACY_SETTINGS,
        backupSettings: DEFAULT_BACKUP_SETTINGS,
        appearanceSettings: DEFAULT_APPEARANCE_SETTINGS,
        calendarSync: DEFAULT_CALENDAR_SYNC,
        appRating: null,
        profileCompletion: 0,
      });
      useThemeStore.getState().setMode('system');
    });
  },
}));
