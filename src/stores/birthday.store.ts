import { create } from 'zustand';

interface BirthdayStoreState {
  birthdaysThisMonth: number;
  streakDays: number;
  upcomingThisWeek: number;
  hydratedAt: string | null;
  setInsights: (insights: {
    birthdaysThisMonth: number;
    streakDays: number;
    upcomingThisWeek: number;
  }) => void;
  reset: () => void;
}

export const useBirthdayStore = create<BirthdayStoreState>()((set) => ({
  birthdaysThisMonth: 0,
  streakDays: 0,
  upcomingThisWeek: 0,
  hydratedAt: null,

  setInsights: (insights) =>
    set({ ...insights, hydratedAt: new Date().toISOString() }),

  reset: () =>
    set({ birthdaysThisMonth: 0, streakDays: 0, upcomingThisWeek: 0, hydratedAt: null }),
}));
