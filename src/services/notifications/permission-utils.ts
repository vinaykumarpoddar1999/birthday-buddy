type NotificationPermissionRecord = {
  granted?: boolean;
  status?: string;
};

/** Cross-platform check for notification permission (SDK 54+). */
export function isNotificationPermissionGranted(
  permissions: NotificationPermissionRecord,
): boolean {
  if (permissions.granted === true) return true;
  if (permissions.status === 'granted') return true;
  return false;
}
