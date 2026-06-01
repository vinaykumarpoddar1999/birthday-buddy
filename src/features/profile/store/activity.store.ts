import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ActivityEntry, AppNotification, FeedbackEntry } from '../types';

const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'birthday', title: "Aisha's Birthday Tomorrow!", message: "Don't forget to wish Aisha Khan a happy birthday!", timestamp: '2026-06-01T08:00:00.000Z', isRead: false, personId: 'seed-1' },
  { id: 'n2', type: 'reminder', title: 'Reminder: Arjun Verma', message: "Arjun's birthday is in 2 days. Prepare a wish!", timestamp: '2026-06-01T07:00:00.000Z', isRead: false, personId: 'seed-2' },
  { id: 'n3', type: 'wish', title: 'AI Wish Ready', message: 'Your personalized wish for Naina Roy is ready to share.', timestamp: '2026-05-31T18:00:00.000Z', isRead: false, personId: 'seed-3' },
  { id: 'n4', type: 'system', title: 'Welcome to BirthdayBuddy!', message: 'Start by adding your friends and family members.', timestamp: '2026-05-30T10:00:00.000Z', isRead: true },
  { id: 'n5', type: 'premium', title: 'Premium Feature Unlocked', message: 'You now have access to unlimited AI wishes and premium cards.', timestamp: '2026-05-29T12:00:00.000Z', isRead: true },
  { id: 'n6', type: 'activity', title: 'Card Created', message: "You created a beautiful card for Meera's birthday.", timestamp: '2026-05-28T15:00:00.000Z', isRead: true },
  { id: 'n7', type: 'birthday', title: "Kabir's Birthday Next Week", message: "Kabir Shah's birthday is on June 6th. Start planning!", timestamp: '2026-05-28T09:00:00.000Z', isRead: true, personId: 'seed-4' },
  { id: 'n8', type: 'reminder', title: 'Weekly Summary', message: 'You have 5 birthdays coming up this week. Stay prepared!', timestamp: '2026-05-27T08:00:00.000Z', isRead: true },
];

const SEED_ACTIVITIES: ActivityEntry[] = [
  { id: 'a1', type: 'wish_generated', title: 'Generated AI Wish', description: 'Created a heartfelt birthday wish for Naina Roy', timestamp: '2026-05-31T18:00:00.000Z', personId: 'seed-3', personName: 'Naina Roy' },
  { id: 'a2', type: 'card_created', title: 'Created Birthday Card', description: 'Designed a confetti celebration card for Meera Iyer', timestamp: '2026-05-28T15:00:00.000Z', personId: 'seed-5', personName: 'Meera Iyer' },
  { id: 'a3', type: 'person_added', title: 'Added New Person', description: 'Added Farah Khan to your contacts', timestamp: '2026-05-25T10:00:00.000Z', personId: 'seed-8', personName: 'Farah Khan' },
  { id: 'a4', type: 'card_shared', title: 'Shared Birthday Card', description: 'Shared birthday card with Dev Malhotra via WhatsApp', timestamp: '2026-05-22T14:00:00.000Z', personId: 'seed-6', personName: 'Dev Malhotra' },
  { id: 'a5', type: 'reminder_set', title: 'Reminder Updated', description: 'Set birthday reminder for Isha Nair - 3 days before', timestamp: '2026-05-20T09:00:00.000Z', personId: 'seed-7', personName: 'Isha Nair' },
  { id: 'a6', type: 'person_edited', title: 'Updated Contact', description: "Updated Rohan Mehta's birthday details", timestamp: '2026-05-18T11:00:00.000Z', personId: 'seed-9', personName: 'Rohan Mehta' },
  { id: 'a7', type: 'wish_generated', title: 'Generated AI Wish', description: 'Created a funny birthday wish for Arjun Verma', timestamp: '2026-05-15T16:00:00.000Z', personId: 'seed-2', personName: 'Arjun Verma' },
  { id: 'a8', type: 'card_downloaded', title: 'Downloaded Card', description: 'Downloaded birthday card for Sneha Kapoor', timestamp: '2026-05-12T13:00:00.000Z', personId: 'seed-14', personName: 'Sneha Kapoor' },
];

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

export const useActivityStore = create<ActivityStoreState>()(
  persist(
    (set, get) => ({
      notifications: SEED_NOTIFICATIONS,
      activities: SEED_ACTIVITIES,
      feedbacks: [],
      recentSearches: ['Aisha', 'Birthday card', 'Reminder settings'],

      addNotification: (notification) =>
        set((s) => ({
          notifications: [
            { ...notification, id: `n-${Date.now()}`, timestamp: new Date().toISOString(), isRead: false },
            ...s.notifications,
          ].slice(0, 100),
        })),

      markAsRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        })),

      markAllAsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      deleteNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      clearAllNotifications: () => set({ notifications: [] }),

      getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,

      addActivity: (activity) =>
        set((s) => ({
          activities: [
            { ...activity, id: `a-${Date.now()}`, timestamp: new Date().toISOString() },
            ...s.activities,
          ].slice(0, 200),
        })),

      clearActivities: () => set({ activities: [] }),

      addFeedback: (feedback) =>
        set((s) => ({
          feedbacks: [
            { ...feedback, id: `fb-${Date.now()}`, createdAt: new Date().toISOString() },
            ...s.feedbacks,
          ],
        })),

      addRecentSearch: (query) =>
        set((s) => ({
          recentSearches: [query, ...s.recentSearches.filter((q) => q !== query)].slice(0, 10),
        })),

      removeRecentSearch: (query) =>
        set((s) => ({ recentSearches: s.recentSearches.filter((q) => q !== query) })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      resetStore: () =>
        set({
          notifications: SEED_NOTIFICATIONS,
          activities: SEED_ACTIVITIES,
          feedbacks: [],
          recentSearches: [],
        }),
    }),
    {
      name: 'birthday-buddy-activity-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
