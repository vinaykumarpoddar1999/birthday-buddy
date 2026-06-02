import Constants from 'expo-constants';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { dailyBirthdayCheckService } from '@/services/notifications/daily-birthday-check.service';
import { reminderService } from '@/services/reminder/reminder.service';
import {
  ensureNotificationHandler,
  registerForNotifications,
} from '@/services/notifications/notification-init.utils';

export const BACKGROUND_BIRTHDAY_TASK = 'background-birthday-check';

const isExpoGo = Constants.appOwnership === 'expo';

TaskManager.defineTask(BACKGROUND_BIRTHDAY_TASK, async () => {
  try {
    await dailyBirthdayCheckService.run();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function initializeNotificationSystem(): Promise<void> {
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
  if (!isExpoGo) {
    await registerBackgroundBirthdayTask();
  }
}

async function registerBackgroundBirthdayTask(): Promise<void> {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) return;

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_BIRTHDAY_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_BIRTHDAY_TASK, {
        minimumInterval: 60 * 60 * 12,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  } catch {
    /* Background fetch unavailable in Expo Go, web, or simulator */
  }
}
