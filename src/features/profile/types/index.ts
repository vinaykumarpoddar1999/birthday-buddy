export type AppLanguage = 'english' | 'hindi' | 'bengali' | 'spanish' | 'french' | 'german';
export type AppCurrency = 'INR' | 'USD' | 'EUR' | 'GBP';
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
  isPremium: boolean;
  streak: number;
  joinedAt: string;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  birthdayAlerts: boolean;
  wishSuggestions: boolean;
  specialEventAlerts: boolean;
  systemNotifications: boolean;
}

export interface ReminderSettings {
  defaultTime: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  birthdayAlarm: boolean;
}

export interface PrivacySettings {
  faceId: boolean;
  biometricLock: boolean;
  appLock: boolean;
  hidePersonalData: boolean;
}

export interface BackupSettings {
  cloudBackup: boolean;
  localBackup: boolean;
  lastBackupDate: string | null;
  backupStatus: 'idle' | 'backing_up' | 'restoring' | 'completed' | 'failed';
}

export interface AppNotification {
  id: string;
  type: 'birthday' | 'wish' | 'reminder' | 'system' | 'premium' | 'activity';
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
  type: 'wish_generated' | 'card_created' | 'person_added' | 'person_edited' | 'person_deleted' | 'reminder_set' | 'card_shared' | 'card_downloaded';
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
