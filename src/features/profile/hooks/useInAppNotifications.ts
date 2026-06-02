import { useActivityStore } from '@features/profile/store/activity.store';
import { useNotificationStore } from '@/stores/notification.store';
import type { AppNotification } from '@features/profile/types';

/** @deprecated Use useNotificationStore directly for in-app notifications */
export function useInAppNotifications() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const clearAllNotifications = useNotificationStore((s) => s.clearAllNotifications);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const getUnreadCount = useNotificationStore((s) => s.getUnreadCount);
  return {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    getUnreadCount,
  };
}

/** Backward-compatible shim: activity store notification methods delegate to notification store */
export function syncActivityNotificationShim(): void {
  const notifState = useNotificationStore.getState();
  useActivityStore.setState({
    notifications: notifState.notifications,
    markAsRead: notifState.markAsRead,
    markAllAsRead: notifState.markAllAsRead,
    deleteNotification: notifState.deleteNotification,
    clearAllNotifications: notifState.clearAllNotifications,
    addNotification: notifState.addNotification as (n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void,
    getUnreadCount: notifState.getUnreadCount,
  });
}
