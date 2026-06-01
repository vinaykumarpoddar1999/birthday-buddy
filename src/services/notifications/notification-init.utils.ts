import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';
import {
  DEFAULT_REMINDER_SETTINGS,
} from '@/services/profile/profile.service';
import type { ReminderSettings } from '@features/profile/types';

import { isNotificationPermissionGranted } from './permission-utils';

let handlerRegistered = false;

export function ensureNotificationHandler(): void {
  if (handlerRegistered) return;
  handlerRegistered = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

async function setupAndroidNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const ext = await settingsRepository.getJson<Partial<ReminderSettings>>('reminder_settings_ext');
  const settings: ReminderSettings = { ...DEFAULT_REMINDER_SETTINGS, ...ext };

  await Notifications.setNotificationChannelAsync('birthday-reminders', {
    name: 'Birthday Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: settings.notificationSound ? 'default' : undefined,
    vibrationPattern: settings.vibration ? [0, 250, 250, 250] : undefined,
  });

  await Notifications.setNotificationChannelAsync('birthday-alarms', {
    name: 'Birthday Alarms',
    importance: Notifications.AndroidImportance.MAX,
    sound: settings.notificationSound ? 'default' : undefined,
    bypassDnd: true,
    vibrationPattern: settings.vibration ? [0, 500, 200, 500] : undefined,
  });

  await Notifications.setNotificationChannelAsync('default', {
    name: 'General',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function registerForNotifications(): Promise<boolean> {
  ensureNotificationHandler();

  const existing = await Notifications.getPermissionsAsync();
  if (isNotificationPermissionGranted(existing)) {
    await setupAndroidNotificationChannels();
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });

  if (isNotificationPermissionGranted(requested)) {
    await setupAndroidNotificationChannels();
    return true;
  }

  return false;
}
