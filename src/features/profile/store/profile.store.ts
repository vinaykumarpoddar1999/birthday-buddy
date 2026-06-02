import { create } from 'zustand';

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
import { useBirthdayStore } from '@/stores/birthday.store';
import { useCalendarStore } from '@/stores/calendar.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useUserStore, calcProfileCompletion } from '@/stores/user.store';
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

let persistQueue: Promise<void> = Promise.resolve();

function snapshotForPersistence() {
  const user = useUserStore.getState();
  const settings = useSettingsStore.getState();
  const calendar = useCalendarStore.getState();
  return {
    profile: { ...user.profile },
    language: settings.language,
    currency: settings.currency,
    theme: settings.theme,
    appIcon: settings.appIcon,
    hapticFeedback: settings.hapticFeedback,
    notificationPrefs: { ...settings.notificationPrefs },
    reminderSettings: {
      ...settings.reminderSettings,
      reminderDaysBefore: [...settings.reminderSettings.reminderDaysBefore],
      multipleReminderTimes: [...settings.reminderSettings.multipleReminderTimes],
    },
    privacySettings: { ...settings.privacySettings },
    backupSettings: { ...settings.backupSettings },
    appearanceSettings: { ...settings.appearanceSettings },
    calendarSync: {
      google: { ...calendar.calendarSync.google },
      apple: { ...calendar.calendarSync.apple },
      outlook: { ...calendar.calendarSync.outlook },
    },
    appRating: settings.appRating,
  };
}

function persistState(): void {
  const snapshot = snapshotForPersistence();
  persistQueue = persistQueue
    .then(() => profileService.saveBundle(snapshot))
    .catch((error) => {
      console.warn('[ProfileStore] Failed to persist settings to SQLite:', error);
    });
}

let rescheduleTimer: ReturnType<typeof setTimeout> | null = null;

function queueReminderReschedule(): void {
  if (rescheduleTimer) clearTimeout(rescheduleTimer);
  rescheduleTimer = setTimeout(() => {
    void import('@/services/reminder/reminder.service').then(({ reminderService }) =>
      reminderService.rescheduleAll(),
    );
  }, 400);
}

function syncProfileStoreFromDomains(set: (partial: Partial<ProfileStoreState>) => void): void {
  const user = useUserStore.getState();
  const settings = useSettingsStore.getState();
  const calendar = useCalendarStore.getState();
  set({
    profile: user.profile,
    profileCompletion: user.profileCompletion,
    language: settings.language,
    currency: settings.currency,
    theme: settings.theme,
    appIcon: settings.appIcon,
    hapticFeedback: settings.hapticFeedback,
    notificationPrefs: settings.notificationPrefs,
    reminderSettings: settings.reminderSettings,
    privacySettings: settings.privacySettings,
    backupSettings: settings.backupSettings,
    appearanceSettings: settings.appearanceSettings,
    calendarSync: calendar.calendarSync,
    appRating: settings.appRating,
  });
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
    useUserStore.getState().updateProfile(updates);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  setLanguage: (language) => {
    useSettingsStore.getState().setLanguage(language);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  setCurrency: (currency) => {
    useSettingsStore.getState().setCurrency(currency);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  setTheme: (theme) => {
    useSettingsStore.getState().setTheme(theme);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  setAppIcon: (appIcon) => {
    useSettingsStore.getState().setAppIcon(appIcon);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  setHapticFeedback: (hapticFeedback) => {
    useSettingsStore.getState().setHapticFeedback(hapticFeedback);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  updateNotificationPrefs: (updates) => {
    useSettingsStore.getState().updateNotificationPrefs(updates);
    syncProfileStoreFromDomains(set);
    persistState();
    queueReminderReschedule();
  },

  updateReminderSettings: (updates) => {
    useSettingsStore.getState().updateReminderSettings(updates);
    syncProfileStoreFromDomains(set);
    persistState();
    queueReminderReschedule();
  },

  updatePrivacySettings: (updates) => {
    useSettingsStore.getState().updatePrivacySettings(updates);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  updateBackupSettings: (updates) => {
    useSettingsStore.getState().updateBackupSettings(updates);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  updateAppearanceSettings: (updates) => {
    useSettingsStore.getState().updateAppearanceSettings(updates);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  updateCalendarSync: (updates) => {
    useCalendarStore.getState().updateCalendarSync(updates);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  setAppRating: (appRating) => {
    useSettingsStore.getState().setAppRating(appRating);
    syncProfileStoreFromDomains(set);
    persistState();
  },

  deleteAccount: async () => {
    const { accountService } = await import('@/services/account/account.service');
    await accountService.wipeLocalData();
  },

  resetStore: () => {
    void profileService.resetToDefaults().then(() => {
      useUserStore.getState().reset();
      useSettingsStore.getState().reset();
      useCalendarStore.getState().reset();
      useBirthdayStore.getState().reset();
      syncProfileStoreFromDomains(set);
    });
  },
}));

export function hydrateProfileDomains(bundle: {
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
}): void {
  useUserStore.getState().hydrate(bundle.profile);
  useSettingsStore.getState().hydrate({
    language: bundle.language,
    currency: bundle.currency,
    theme: bundle.theme,
    appIcon: bundle.appIcon,
    hapticFeedback: bundle.hapticFeedback,
    notificationPrefs: bundle.notificationPrefs,
    reminderSettings: bundle.reminderSettings,
    privacySettings: bundle.privacySettings,
    backupSettings: bundle.backupSettings,
    appearanceSettings: bundle.appearanceSettings,
    appRating: bundle.appRating,
  });
  useCalendarStore.getState().hydrate(bundle.calendarSync);
  useProfileStore.setState({
    profile: bundle.profile,
    profileCompletion: bundle.profileCompletion ?? calcProfileCompletion(bundle.profile),
    language: bundle.language,
    currency: bundle.currency,
    theme: bundle.theme,
    appIcon: bundle.appIcon,
    hapticFeedback: bundle.hapticFeedback,
    notificationPrefs: bundle.notificationPrefs,
    reminderSettings: bundle.reminderSettings,
    privacySettings: bundle.privacySettings,
    backupSettings: bundle.backupSettings,
    appearanceSettings: bundle.appearanceSettings,
    calendarSync: bundle.calendarSync,
    appRating: bundle.appRating,
  });
}
