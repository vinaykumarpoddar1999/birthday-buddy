export type AppSettings = {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  defaultReminderDays: number[];
  language: string;
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  notificationsEnabled: true,
  defaultReminderDays: [7, 3, 1, 0],
  language: 'en',
};
