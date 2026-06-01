import { create } from 'zustand';

import { appNotificationService } from '@/services/notifications/app-notification.service';
import { profileService } from '@/services/profile/profile.service';
import type { ActivityEntry, AppNotification, FeedbackEntry } from '../types';

interface ActivityStoreState {
  notifications: AppNotification[];
  activities: ActivityEntry[];
  feedbacks: FeedbackEntry[];
  recentSearches: string[];

  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;

  addActivity: (activity: Omit<ActivityEntry, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;

  addFeedback: (feedback: Omit<FeedbackEntry, 'id' | 'createdAt'>) => void;

  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  resetStore: () => void;
}

async function persistRecentSearches(searches: string[]): Promise<void> {
  await profileService.saveRecentSearches(searches);
}

export const useActivityStore = create<ActivityStoreState>()((set, get) => ({
  notifications: [],
  activities: [],
  feedbacks: [],
  recentSearches: [],

  addNotification: (notification) => {
    void appNotificationService
      .add(notification)
      .then((id) => {
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

  addActivity: (activity) =>
    set((s) => ({
      activities: [
        { ...activity, id: `a-${Date.now()}`, timestamp: new Date().toISOString() },
        ...s.activities,
      ].slice(0, 200),
    })),

  clearActivities: () => set({ activities: [] }),

  addFeedback: (feedback) => {
    void import('@/services/feedback/feedback.service').then(({ feedbackService }) =>
      feedbackService.submit(feedback.subject, feedback.category, feedback.message).then((entry) => {
        set((s) => ({
          feedbacks: [entry, ...s.feedbacks].slice(0, 50),
        }));
      }),
    );
  },

  addRecentSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    set((s) => {
      const recentSearches = [trimmed, ...s.recentSearches.filter((q) => q !== trimmed)].slice(0, 10);
      void persistRecentSearches(recentSearches);
      return { recentSearches };
    });
  },

  removeRecentSearch: (query) => {
    set((s) => {
      const recentSearches = s.recentSearches.filter((q) => q !== query);
      void persistRecentSearches(recentSearches);
      return { recentSearches };
    });
  },

  clearRecentSearches: () => {
    void persistRecentSearches([]);
    set({ recentSearches: [] });
  },

  resetStore: () =>
    set({
      notifications: [],
      activities: [],
      feedbacks: [],
      recentSearches: [],
    }),
}));
