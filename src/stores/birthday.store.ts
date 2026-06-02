import { create } from 'zustand';

interface BirthdayStoreState {
  remindersToday: number;
  streakDays: number;
  upcomingThisWeek: number;
  hydratedAt: string | null;
  setInsights: (insights: {
    remindersToday: number;
    streakDays: number;
    upcomingThisWeek: number;
  }) => void;
  reset: () => void;
}

export const useBirthdayStore = create<BirthdayStoreState>()((set) => ({
  remindersToday: 0,
  streakDays: 0,
  upcomingThisWeek: 0,
  hydratedAt: null,

  setInsights: (insights) =>
    set({ ...insights, hydratedAt: new Date().toISOString() }),

  reset: () =>
    set({ remindersToday: 0, streakDays: 0, upcomingThisWeek: 0, hydratedAt: null }),
}));
