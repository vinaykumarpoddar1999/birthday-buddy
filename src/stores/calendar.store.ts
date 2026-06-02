import { create } from 'zustand';

import { DEFAULT_CALENDAR_SYNC } from '@/services/profile/profile.service';
import type { CalendarSyncSettings } from '@features/profile/types';

interface CalendarStoreState {
  calendarSync: CalendarSyncSettings;
  eventIdMap: Record<string, string>;
  updateCalendarSync: (updates: Partial<CalendarSyncSettings>) => void;
  setEventId: (personId: string, eventId: string) => void;
  removeEventId: (personId: string) => void;
  getEventId: (personId: string) => string | undefined;
  hydrate: (calendarSync: CalendarSyncSettings, eventIdMap?: Record<string, string>) => void;
  reset: () => void;
}

export const useCalendarStore = create<CalendarStoreState>()((set, get) => ({
  calendarSync: DEFAULT_CALENDAR_SYNC,
  eventIdMap: {},

  updateCalendarSync: (updates) =>
    set((s) => ({ calendarSync: { ...s.calendarSync, ...updates } })),

  setEventId: (personId, eventId) =>
    set((s) => ({ eventIdMap: { ...s.eventIdMap, [personId]: eventId } })),

  removeEventId: (personId) =>
    set((s) => {
      const eventIdMap = { ...s.eventIdMap };
      delete eventIdMap[personId];
      return { eventIdMap };
    }),

  getEventId: (personId) => get().eventIdMap[personId],

  hydrate: (calendarSync, eventIdMap = {}) => set({ calendarSync, eventIdMap }),

  reset: () => set({ calendarSync: DEFAULT_CALENDAR_SYNC, eventIdMap: {} }),
}));
