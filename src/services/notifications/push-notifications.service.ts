import * as Notifications from 'expo-notifications';

import { isNotificationPermissionGranted } from './permission-utils';

export async function registerForPushNotifications(): Promise<string | null> {
  const permissions = await Notifications.requestPermissionsAsync();
  if (!isNotificationPermissionGranted(permissions)) return null;
  return null;
}

export async function saveDeviceToken(_token: string): Promise<void> {
  // Offline v1: no remote token storage
}

export async function syncPushToken(): Promise<void> {
  // Offline v1: no-op
}
