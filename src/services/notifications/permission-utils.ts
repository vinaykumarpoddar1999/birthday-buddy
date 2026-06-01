import type { NotificationPermissionsStatus } from 'expo-notifications';

/** Cross-platform check for notification permission (SDK 54+). */
export function isNotificationPermissionGranted(
  permissions: NotificationPermissionsStatus,
): boolean {
  const record = permissions as NotificationPermissionsStatus & {
    granted?: boolean;
    status?: string;
  };
  if (record.granted === true) return true;
  if (record.status === 'granted') return true;
  return false;
}
