import { create } from 'zustand';
import { Vibration } from 'react-native';

import {
  DEFAULT_APPEARANCE_SETTINGS,
  DEFAULT_BACKUP_SETTINGS,
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_REMINDER_SETTINGS,
} from '@/services/profile/profile.service';
import { normalizeReminderSettings } from '@features/profile/utils/reminder-settings.utils';
import { useThemeStore } from '@/stores/theme.store';
import type {
  AppearanceSettings,
  AppCurrency,
  AppIconOption,
  AppLanguage,
  BackupSettings,
  NotificationPreferences,
  PrivacySettings,
  ReminderSettings,
} from '@features/profile/types';

interface SettingsStoreState {
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
  appRating: number | null;

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
  setAppRating: (rating: number) => void;
  hydrate: (partial: Partial<SettingsStoreState>) => void;
  reset: () => void;
}

const DEFAULT_STATE = {
  language: 'english' as AppLanguage,
  currency: 'INR' as AppCurrency,
  theme: 'system' as const,
  appIcon: 'classic' as AppIconOption,
  hapticFeedback: true,
  notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
  reminderSettings: DEFAULT_REMINDER_SETTINGS,
  privacySettings: DEFAULT_PRIVACY_SETTINGS,
  backupSettings: DEFAULT_BACKUP_SETTINGS,
  appearanceSettings: DEFAULT_APPEARANCE_SETTINGS,
  appRating: null as number | null,
};

function withHaptic(action: () => void): void {
  action();
  if (!useSettingsStore.getState().hapticFeedback) return;
  try {
    Vibration.vibrate(10);
  } catch {
    /* unsupported */
  }
}

export const useSettingsStore = create<SettingsStoreState>()((set) => ({
  ...DEFAULT_STATE,

  setLanguage: (language) => withHaptic(() => set({ language })),
  setCurrency: (currency) => withHaptic(() => set({ currency })),
  setTheme: (theme) =>
    withHaptic(() => {
      useThemeStore.getState().setMode(theme);
      set((s) => ({ theme, appearanceSettings: { ...s.appearanceSettings, theme } }));
    }),
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
  updateAppearanceSettings: (updates) =>
    set((s) => {
      const appearanceSettings = { ...s.appearanceSettings, ...updates };
      if (updates.theme) {
        useThemeStore.getState().setMode(updates.theme);
        return { appearanceSettings, theme: updates.theme };
      }
      return { appearanceSettings };
    }),
  setAppRating: (appRating) => set({ appRating }),

  hydrate: (partial) =>
    set((s) => {
      if (partial.theme) {
        useThemeStore.getState().setMode(partial.theme);
      }
      if (partial.appearanceSettings?.theme) {
        useThemeStore.getState().setMode(partial.appearanceSettings.theme);
      }
      const reminderSettings = partial.reminderSettings
        ? normalizeReminderSettings({ ...DEFAULT_REMINDER_SETTINGS, ...partial.reminderSettings })
        : s.reminderSettings;
      return { ...s, ...partial, reminderSettings };
    }),
  reset: () => {
    useThemeStore.getState().setMode('system');
    set({ ...DEFAULT_STATE, notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS }, reminderSettings: { ...DEFAULT_REMINDER_SETTINGS }, privacySettings: { ...DEFAULT_PRIVACY_SETTINGS }, backupSettings: { ...DEFAULT_BACKUP_SETTINGS }, appearanceSettings: { ...DEFAULT_APPEARANCE_SETTINGS } });
  },
}));
