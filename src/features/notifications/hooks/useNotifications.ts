import { useEffect } from 'react';

import {
  requestNotificationPermissions,
  syncPushToken,
} from '@services/notifications';
import { useAuthStore } from '@store/auth.store';
import { useNotificationStore } from '@store/notification.store';

export function useNotifications() {
  const userId = useAuthStore((s) => s.user?.id);
  const setPushToken = useNotificationStore((s) => s.setPushToken);
  const setPermissionGranted = useNotificationStore((s) => s.setPermissionGranted);
  const pushToken = useNotificationStore((s) => s.pushToken);
  const permissionGranted = useNotificationStore((s) => s.permissionGranted);

  useEffect(() => {
    async function setup() {
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);

      if (granted && userId) {
        const token = await syncPushToken(userId);
        setPushToken(token);
      }
    }

    setup();
  }, [userId, setPermissionGranted, setPushToken]);

  return {
    pushToken,
    permissionGranted,
  };
}
