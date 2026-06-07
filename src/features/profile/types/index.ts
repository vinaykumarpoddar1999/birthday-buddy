export type AppLanguage =
  | 'english'
  | 'hindi'
  | 'bengali'
  | 'spanish'
  | 'french'
  | 'german'
  | 'arabic'
  | 'japanese';
export type AppCurrency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
export type ThemeOption = 'light' | 'dark' | 'system';
export type AppIconOption = 'classic' | 'premium' | 'gift' | 'cake' | 'party';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
  location: string;
  bio: string;
  profileImage: string | null;
  relationshipStatus: string;
  relationship: string;
  timezone: string;
  country: string;
  preferences: string;
  isPremium: boolean;
  streak: number;
  joinedAt: string;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  birthdayAlerts: boolean;
  wishSuggestions: boolean;
  cardSuggestions: boolean;
  specialEventAlerts: boolean;
  systemNotifications: boolean;
  marketingNotifications: boolean;
  activityUpdates: boolean;
}

export interface ReminderEntry {
  id: string;
  daysBefore: number;
  time: string;
}

export interface ReminderSettings {
  defaultTime: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  birthdayAlarm: boolean;
  reminderDaysBefore: number[];
  multipleReminderTimes: string[];
  reminderEntries: ReminderEntry[];
  weekendRules: 'same' | 'skip' | 'earlier';
  notificationSound: boolean;
  vibration: boolean;
  timingMode: 'fixed' | 'flexible';
}

export interface PrivacySettings {
  systemLockEnabled: boolean;
}

export interface BackupSettings {
  cloudBackup: boolean;
  localBackup: boolean;
  autoBackup: boolean;
  lastBackupDate: string | null;
  backupStatus: 'idle' | 'backing_up' | 'restoring' | 'completed' | 'failed';
}

export interface AppearanceSettings {
  theme: ThemeOption;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  cardStyle: 'classic' | 'modern' | 'minimal';
  animationsEnabled: boolean;
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  dynamicTheme: boolean;
}

export interface CalendarSyncProvider {
  enabled: boolean;
  lastSyncAt: string | null;
}

export interface CalendarSyncSettings {
  google: CalendarSyncProvider;
  apple: CalendarSyncProvider;
  outlook: CalendarSyncProvider;
}

export interface AppNotification {
  id: string;
  type: 'birthday' | 'wish' | 'reminder' | 'system' | 'premium' | 'activity' | 'card' | 'alarm' | 'calendar' | 'update';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  personId?: string;
  actionType?: string;
  actionPayload?: string;
}

export interface ActivityEntry {
  id: string;
  type:
    | 'wish_generated'
    | 'card_created'
    | 'person_added'
    | 'person_edited'
    | 'person_deleted'
    | 'reminder_set'
    | 'card_shared'
    | 'card_downloaded'
    | 'settings_changed'
    | 'backup_created'
    | 'import_performed'
    | 'export_performed';
  title: string;
  description: string;
  timestamp: string;
  personId?: string;
  personName?: string;
  metadata?: Record<string, string>;
}

export interface FeedbackEntry {
  id: string;
  subject: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  message: string;
  screenshotUri?: string;
  createdAt: string;
  rating?: number;
}

export interface CardHistoryEntry {
  id: string;
  cardUuid?: string;
  templateId?: string;
  personId?: string;
  action: 'created' | 'downloaded' | 'shared' | 'favorite' | 'draft';
  title: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface SearchResult {
  id: string;
  type: 'person' | 'event' | 'wish' | 'card' | 'setting';
  title: string;
  subtitle: string;
  icon?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
