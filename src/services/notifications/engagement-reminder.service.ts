import { Platform } from 'react-native';

import { getNotificationsModule } from './notifications-api';
import { registerForNotifications } from './notification-init.utils';

export const ENGAGEMENT_REMINDER_ID = 'engagement-add-friends-weekly';
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

const ENGAGEMENT_MESSAGE =
  'Add more friends to Birthday Buddy and never miss an important birthday again.';

export async function scheduleEngagementReminder(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  const granted = await registerForNotifications();
  if (!granted) return;

  await Notifications.cancelScheduledNotificationAsync(ENGAGEMENT_REMINDER_ID).catch(() => undefined);

  await Notifications.scheduleNotificationAsync({
    identifier: ENGAGEMENT_REMINDER_ID,
    content: {
      title: 'Keep your circle growing',
      body: ENGAGEMENT_MESSAGE,
      data: { type: 'engagement-reminder' },
      ...(Platform.OS === 'android' ? { android: { channelId: 'default' } } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEVEN_DAYS_SECONDS,
      repeats: true,
      ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
    },
  });
}

export async function cancelEngagementReminder(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(ENGAGEMENT_REMINDER_ID).catch(() => undefined);
}
