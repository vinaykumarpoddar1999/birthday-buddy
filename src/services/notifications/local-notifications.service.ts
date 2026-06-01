import * as Notifications from 'expo-notifications';

import { REMINDER_OFFSETS_DAYS } from '@/constants/app';
import { handleApiError } from '@shared/errors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type ScheduleBirthdayRemindersInput = {
  contactId: string;
  contactName: string;
  birthdayDate: Date;
};

export async function requestNotificationPermissions(): Promise<boolean> {
  const existing = (await Notifications.getPermissionsAsync()).status;
  if (existing === 'granted') return true;

  const status = (await Notifications.requestPermissionsAsync()).status;
  return status === 'granted';
}

export async function scheduleBirthdayReminders(
  input: ScheduleBirthdayRemindersInput,
): Promise<string[]> {
  const scheduledIds: string[] = [];

  try {
    for (const daysBefore of REMINDER_OFFSETS_DAYS) {
      const triggerDate = new Date(input.birthdayDate);
      triggerDate.setFullYear(new Date().getFullYear());
      triggerDate.setDate(triggerDate.getDate() - daysBefore);
      triggerDate.setHours(daysBefore === 0 ? 8 : 9, 0, 0, 0);

      if (triggerDate <= new Date()) continue;

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title:
            daysBefore === 0
              ? `${input.contactName}'s birthday is today!`
              : `${input.contactName}'s birthday in ${daysBefore} day(s)`,
          body: 'Open BirthdayBuddy to celebrate',
          data: { contactId: input.contactId, daysBefore },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });

      scheduledIds.push(id);
    }
  } catch (error) {
    throw handleApiError(error);
  }

  return scheduledIds;
}

export async function cancelScheduledNotifications(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}
