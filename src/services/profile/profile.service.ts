import { settingsRepository } from '@/repositories/settings.repository';
import { settingsService } from '@/services/settings/settings.service';
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
  ThemeOption,
  UserProfile,
} from '@features/profile/types';
import { generateUuidSync } from '@/utils/uuid';

const KEYS = {
  profile: 'user_profile',
  notificationPrefs: 'notification_prefs',
  reminderSettings: 'reminder_settings_ext',
  privacySettings: 'privacy_settings',
  backupSettings: 'backup_settings',
  appearanceSettings: 'appearance_settings',
  calendarSync: 'calendar_sync_prefs',
  appIcon: 'app_icon',
  hapticFeedback: 'haptic_feedback',
  appRating: 'app_rating',
  aiCredits: 'ai_credits',
  recentSearches: 'recent_searches',
} as const;

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'local-user',
  fullName: '',
  email: '',
  phone: '',
  gender: 'other',
  birthday: '',
  location: '',
  bio: '',
  profileImage: null,
  relationshipStatus: '',
  preferences: '',
  isPremium: false,
  streak: 0,
  joinedAt: new Date().toISOString(),
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  pushNotifications: true,
  birthdayAlerts: true,
  wishSuggestions: true,
  cardSuggestions: true,
  specialEventAlerts: true,
  systemNotifications: true,
  marketingNotifications: false,
  activityUpdates: true,
};

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  defaultTime: '08:00',
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  birthdayAlarm: true,
  reminderDaysBefore: [7, 3, 1, 0],
  multipleReminderTimes: ['08:00'],
  weekendRules: 'same',
  notificationSound: true,
  vibration: true,
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  faceId: false,
  biometricLock: false,
  appLock: false,
  hidePersonalData: false,
  privateMode: false,
  autoLockMinutes: 5,
};

export const DEFAULT_BACKUP_SETTINGS: BackupSettings = {
  cloudBackup: false,
  localBackup: true,
  autoBackup: false,
  lastBackupDate: null,
  backupStatus: 'idle',
};

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  theme: 'system',
  accentColor: '#7C3AED',
  fontSize: 'medium',
  cardStyle: 'modern',
  animationsEnabled: true,
  layoutDensity: 'comfortable',
};

export const DEFAULT_CALENDAR_SYNC: CalendarSyncSettings = {
  google: { enabled: false, lastSyncAt: null },
  apple: { enabled: false, lastSyncAt: null },
  outlook: { enabled: false, lastSyncAt: null },
};

export interface ProfileBundle {
  profile: UserProfile;
  language: AppLanguage;
  currency: AppCurrency;
  theme: ThemeOption;
  appIcon: AppIconOption;
  hapticFeedback: boolean;
  notificationPrefs: NotificationPreferences;
  reminderSettings: ReminderSettings;
  privacySettings: PrivacySettings;
  backupSettings: BackupSettings;
  appearanceSettings: AppearanceSettings;
  calendarSync: CalendarSyncSettings;
  appRating: number | null;
  aiCredits: number;
}

export const DEFAULT_PROFILE_BUNDLE: ProfileBundle = {
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
  aiCredits: 24,
};

function calcProfileCompletion(profile: UserProfile): number {
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
}

function mergeProfile(raw: Partial<UserProfile> | null): UserProfile {
  return {
    ...DEFAULT_USER_PROFILE,
    ...raw,
    id: raw?.id ?? generateUuidSync(),
  };
}

function mergePrefs<T extends object>(defaults: T, raw: Partial<T> | null): T {
  return { ...defaults, ...(raw ?? {}) };
}

export class ProfileService {
  async load(): Promise<ProfileBundle & { profileCompletion: number }> {
    const appSettings = await settingsService.getAll();
    const profile = mergeProfile(await settingsRepository.getJson<UserProfile>(KEYS.profile));
    const language = mapLanguage((await settingsRepository.get('language')) ?? appSettings.language);
    const currency = mapCurrency(appSettings.currency);
    const theme = appSettings.theme as ThemeOption;

    const extReminder = await settingsRepository.getJson<Partial<ReminderSettings>>(KEYS.reminderSettings);

    const bundle: ProfileBundle = {
      profile,
      language,
      currency,
      theme,
      appIcon: ((await settingsRepository.get(KEYS.appIcon)) as AppIconOption) ?? 'classic',
      hapticFeedback: (await settingsRepository.get(KEYS.hapticFeedback)) !== 'false',
      notificationPrefs: mergePrefs(
        DEFAULT_NOTIFICATION_PREFS,
        await settingsRepository.getJson<Partial<NotificationPreferences>>(KEYS.notificationPrefs),
      ),
      reminderSettings: {
        ...DEFAULT_REMINDER_SETTINGS,
        defaultTime: appSettings.reminderTime,
        quietHoursStart: appSettings.quietHoursStart ?? DEFAULT_REMINDER_SETTINGS.quietHoursStart,
        quietHoursEnd: appSettings.quietHoursEnd ?? DEFAULT_REMINDER_SETTINGS.quietHoursEnd,
        ...extReminder,
      },
      privacySettings: mergePrefs(
        DEFAULT_PRIVACY_SETTINGS,
        await settingsRepository.getJson<Partial<PrivacySettings>>(KEYS.privacySettings),
      ),
      backupSettings: mergePrefs(
        DEFAULT_BACKUP_SETTINGS,
        await settingsRepository.getJson<Partial<BackupSettings>>(KEYS.backupSettings),
      ),
      appearanceSettings: mergePrefs(
        { ...DEFAULT_APPEARANCE_SETTINGS, theme },
        await settingsRepository.getJson<Partial<AppearanceSettings>>(KEYS.appearanceSettings),
      ),
      calendarSync: mergePrefs(
        DEFAULT_CALENDAR_SYNC,
        await settingsRepository.getJson<Partial<CalendarSyncSettings>>(KEYS.calendarSync),
      ),
      appRating: parseRating(await settingsRepository.get(KEYS.appRating)),
      aiCredits: parseInt((await settingsRepository.get(KEYS.aiCredits)) ?? '24', 10) || 24,
    };

    return { ...bundle, profileCompletion: calcProfileCompletion(profile) };
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await settingsRepository.setJson(KEYS.profile, profile);
  }

  async saveBundle(patch: Partial<ProfileBundle>): Promise<void> {
    if (patch.profile) await this.saveProfile(patch.profile);
    if (patch.language) await settingsService.update({ language: patch.language });
    if (patch.currency) await settingsService.update({ currency: patch.currency });
    if (patch.theme) await settingsService.update({ theme: patch.theme });
    if (patch.reminderSettings) {
      const { defaultTime, quietHoursStart, quietHoursEnd, ...ext } = patch.reminderSettings;
      await settingsService.update({
        reminderTime: defaultTime ?? undefined,
        quietHoursStart,
        quietHoursEnd,
      });
      await settingsRepository.setJson(KEYS.reminderSettings, ext);
    }
    if (patch.notificationPrefs) {
      await settingsRepository.setJson(KEYS.notificationPrefs, patch.notificationPrefs);
    }
    if (patch.privacySettings) {
      await settingsRepository.setJson(KEYS.privacySettings, patch.privacySettings);
    }
    if (patch.backupSettings) {
      await settingsRepository.setJson(KEYS.backupSettings, patch.backupSettings);
    }
    if (patch.appearanceSettings) {
      await settingsRepository.setJson(KEYS.appearanceSettings, patch.appearanceSettings);
      if (patch.appearanceSettings.theme) {
        await settingsService.update({ theme: patch.appearanceSettings.theme });
      }
    }
    if (patch.calendarSync) {
      await settingsRepository.setJson(KEYS.calendarSync, patch.calendarSync);
    }
    if (patch.appIcon) await settingsRepository.set(KEYS.appIcon, patch.appIcon);
    if (patch.hapticFeedback !== undefined) {
      await settingsRepository.set(KEYS.hapticFeedback, String(patch.hapticFeedback));
    }
    if (patch.appRating !== undefined) {
      await settingsRepository.set(KEYS.appRating, patch.appRating === null ? '' : String(patch.appRating));
    }
    if (patch.aiCredits !== undefined) {
      await settingsRepository.set(KEYS.aiCredits, String(patch.aiCredits));
    }
  }

  async getRecentSearches(): Promise<string[]> {
    return (await settingsRepository.getJson<string[]>(KEYS.recentSearches)) ?? [];
  }

  async saveRecentSearches(searches: string[]): Promise<void> {
    await settingsRepository.setJson(KEYS.recentSearches, searches.slice(0, 10));
  }

  async resetToDefaults(): Promise<void> {
    await this.saveBundle(DEFAULT_PROFILE_BUNDLE);
    await settingsService.update({
      theme: 'system',
      language: 'en',
      currency: 'INR',
      reminderTime: '08:00',
      notificationsEnabled: true,
      backupAuto: false,
    });
  }
}

function mapLanguage(code: string): AppLanguage {
  const map: Record<string, AppLanguage> = {
    en: 'english',
    hi: 'hindi',
    bn: 'bengali',
    es: 'spanish',
    fr: 'french',
    de: 'german',
    ar: 'arabic',
    ja: 'japanese',
    english: 'english',
    hindi: 'hindi',
    bengali: 'bengali',
    spanish: 'spanish',
    french: 'french',
    german: 'german',
    arabic: 'arabic',
    japanese: 'japanese',
  };
  return map[code] ?? 'english';
}

function mapCurrency(code: string): AppCurrency {
  const valid: AppCurrency[] = ['INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  return valid.includes(code as AppCurrency) ? (code as AppCurrency) : 'INR';
}

function parseRating(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export const profileService = new ProfileService();
