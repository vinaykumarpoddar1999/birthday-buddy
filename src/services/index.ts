export { peopleService, PeopleService } from './people/people.service';
export { birthdayService, BirthdayService } from './birthday/birthday.service';
export { calendarService, CalendarService } from './calendar/calendar.service';
export { wishService, WishService } from './wish/wish.service';
export { birthdayWishService, BirthdayWishService } from './wish/birthday-wish.service';
export type { BirthdayWishCategory } from './wish/birthday-wish.service';
export { cardService, CardService } from './card/card.service';
export { reminderService, ReminderService } from './reminder/reminder.service';
export { searchService, SearchService } from './search/search.service';
export { settingsService, SettingsService } from './settings/settings.service';
export { backupService, BackupService } from './backup/backup.service';
export { activityLogService, ActivityLogService } from './activity/activity-log.service';
export { activityDisplayService, ActivityDisplayService } from './activity/activity-display.service';
export { profileService, ProfileService } from './profile/profile.service';
export { appNotificationService, AppNotificationService } from './notifications/app-notification.service';
export { accountService, AccountService } from './account/account.service';
export { feedbackService, FeedbackService } from './feedback/feedback.service';
export { appIconService, AppIconService } from './app-icon/app-icon.service';
export type { SetAppIconResult } from './app-icon/app-icon.service';
export {
  deviceCalendarService,
  DeviceCalendarService,
  googleCalendarProvider,
} from './calendar/device-calendar.service';
export type { GoogleCalendarProvider } from './calendar/device-calendar.service';
export {
  syncBackupScheduler,
  initializeBackupScheduler,
  BACKGROUND_BACKUP_TASK,
} from './backup/backup-scheduler.service';
