import {
  cancelScheduledNotifications,
  scheduleBirthdayReminders,
  type ScheduleBirthdayRemindersInput,
} from '@services/notifications';

export async function scheduleReminders(input: ScheduleBirthdayRemindersInput) {
  return scheduleBirthdayReminders(input);
}

export async function cancelReminders(notificationIds: string[]) {
  return cancelScheduledNotifications(notificationIds);
}
