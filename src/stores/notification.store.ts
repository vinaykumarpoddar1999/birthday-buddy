import { create } from 'zustand';

import { appNotificationService } from '@/services/notifications/app-notification.service';
import type { AppNotification } from '@features/profile/types';

type PushNotificationState = {
  pushToken: string | null;
  permissionGranted: boolean;
  setPushToken: (token: string | null) => void;
  setPermissionGranted: (granted: boolean) => void;
};

type InAppNotificationState = {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
  getById: (id: string) => AppNotification | undefined;
  hydrateNotifications: (notifications: AppNotification[]) => void;
  resetNotifications: () => void;
};

type NotificationState = PushNotificationState & InAppNotificationState;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  pushToken: null,
  permissionGranted: false,
  notifications: [],

  setPushToken: (pushToken) => set({ pushToken }),
  setPermissionGranted: (permissionGranted) => set({ permissionGranted }),

  addNotification: (notification) => {
    void appNotificationService.add(notification).then((id) => {
      set((s) => ({
        notifications: [
          {
            ...notification,
            id,
            timestamp: new Date().toISOString(),
            isRead: false,
          },
          ...s.notifications,
        ].slice(0, 100),
      }));
    });
  },

  markAsRead: (id) => {
    void appNotificationService.markRead(id);
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  markAllAsRead: () => {
    void appNotificationService.markAllRead();
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  },

  deleteNotification: (id) => {
    void appNotificationService.delete(id);
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
  },

  clearAllNotifications: () => {
    void appNotificationService.clearAll();
    set({ notifications: [] });
  },

  getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,
  getById: (id) => get().notifications.find((n) => n.id === id),

  hydrateNotifications: (notifications) => set({ notifications }),
  resetNotifications: () => set({ notifications: [] }),
}));
