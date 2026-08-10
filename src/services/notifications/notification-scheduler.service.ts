import { registerNotifeeAlarmListeners } from '@/services/notifications/notifee-alarm.service';
import { dailyBirthdayCheckService } from '@/services/notifications/daily-birthday-check.service';
import { scheduleEngagementReminder } from '@/services/notifications/engagement-reminder.service';
import { reminderService } from '@/services/reminder/reminder.service';
import {
  ensureNotificationHandler,
  registerForNotifications,
} from '@/services/notifications/notification-init.utils';

export const BACKGROUND_BIRTHDAY_TASK = 'background-birthday-check';

export async function initializeNotificationSystem(): Promise<void> {
  registerNotifeeAlarmListeners();
  ensureNotificationHandler();
  try {
    await registerForNotifications();
  } catch {
    // Never block app startup if notification setup fails on a device/build variant.
  }
  try {
    await reminderService.rescheduleAll();
  } catch {
    // Keep hydration resilient; reminders can be retried later.
  }
  try {
    await dailyBirthdayCheckService.run();
  } catch {
    // Ignore non-critical notification feed errors during boot.
  }
  try {
    await scheduleEngagementReminder();
  } catch {
    // Engagement reminders are best-effort.
  }
}
