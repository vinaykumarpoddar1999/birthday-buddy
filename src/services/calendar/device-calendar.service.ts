import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';
import { birthdayService } from '@/services/birthday/birthday.service';
import { parseBirthMonthDay } from '@/services/notifications/local-notifications.service';
import type { CalendarSyncSettings } from '@features/profile/types';
import type { Person } from '@/types/entities';

const DEVICE_CALENDAR_EVENT_MAP_KEY = 'device_calendar_event_map';
const BIRTHDAY_CALENDAR_ID_KEY = 'birthdaybuddy_calendar_id';
const CALENDAR_SYNC_PREFS_KEY = 'calendar_sync_prefs';
const BIRTHDAY_CALENDAR_TITLE = 'BirthdayBuddy';

type EventMap = Record<string, string>;

export type CalendarSyncOptions = {
  force?: boolean;
};

export type CalendarSyncResult = {
  synced: number;
  skipped: number;
  failed: number;
  error?: 'permission_denied' | 'no_calendar' | 'no_birthdays';
};

export interface GoogleCalendarProvider {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  syncBirthdays(_people: Person[]): Promise<{ synced: number }>;
}

export const googleCalendarProvider: GoogleCalendarProvider = {
  async connect() {
    return false;
  },
  async disconnect() {
    /* stub */
  },
  async isConnected() {
    return false;
  },
  async syncBirthdays() {
    return { synced: 0 };
  },
};

function nextBirthdayDate(month: number, day: number): Date {
  const now = new Date();
  const year = now.getFullYear();
  let candidate = new Date(year, month - 1, day);
  if (candidate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    candidate = new Date(year + 1, month - 1, day);
  }
  return candidate;
}

async function loadEventMap(): Promise<EventMap> {
  return (await settingsRepository.getJson<EventMap>(DEVICE_CALENDAR_EVENT_MAP_KEY)) ?? {};
}

async function saveEventMap(map: EventMap): Promise<void> {
  await settingsRepository.setJson(DEVICE_CALENDAR_EVENT_MAP_KEY, map);
}

async function isCalendarSyncEnabled(): Promise<boolean> {
  const prefs = await settingsRepository.getJson<CalendarSyncSettings>(CALENDAR_SYNC_PREFS_KEY);
  if (!prefs) return false;
  return prefs.google.enabled || prefs.apple.enabled || prefs.outlook.enabled;
}

async function resolveWritableCalendarSource(): Promise<Calendar.Source | null> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find((c) => c.allowsModifications && c.source);
  if (writable?.source) return writable.source;

  if (Platform.OS === 'ios') {
    const defaultCal = await Calendar.getDefaultCalendarAsync();
    if (defaultCal?.source) return defaultCal.source;
  }

  return calendars[0]?.source ?? null;
}

async function getOrCreateBirthdayCalendarId(): Promise<string | null> {
  const storedId = await settingsRepository.get(BIRTHDAY_CALENDAR_ID_KEY);
  if (storedId) {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      if (calendars.some((c) => c.id === storedId && c.allowsModifications)) {
        return storedId;
      }
    } catch {
      /* re-create below */
    }
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const existing = calendars.find(
    (c) => c.title === BIRTHDAY_CALENDAR_TITLE && c.allowsModifications,
  );
  if (existing) {
    await settingsRepository.set(BIRTHDAY_CALENDAR_ID_KEY, existing.id);
    return existing.id;
  }

  const source = await resolveWritableCalendarSource();
  if (!source) {
    const fallback = calendars.find((c) => c.allowsModifications);
    if (fallback) {
      await settingsRepository.set(BIRTHDAY_CALENDAR_ID_KEY, fallback.id);
      return fallback.id;
    }
    return null;
  }

  try {
    const calendarId = await Calendar.createCalendarAsync({
      title: BIRTHDAY_CALENDAR_TITLE,
      color: '#7C3AED',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: source.id,
      source,
      name: BIRTHDAY_CALENDAR_TITLE,
      ownerAccount: source.name ?? 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    await settingsRepository.set(BIRTHDAY_CALENDAR_ID_KEY, calendarId);
    return calendarId;
  } catch {
    const fallback = calendars.find((c) => c.allowsModifications);
    if (fallback) {
      await settingsRepository.set(BIRTHDAY_CALENDAR_ID_KEY, fallback.id);
      return fallback.id;
    }
    return null;
  }
}

export class DeviceCalendarService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    const current = await Calendar.getCalendarPermissionsAsync();
    if (current.status === 'granted') return true;

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  }

  async addBirthdayEvent(person: Person, options?: CalendarSyncOptions): Promise<string | null> {
    if (!options?.force && !(await isCalendarSyncEnabled())) return null;

    const granted = await this.requestPermissions();
    if (!granted) return null;

    const birth = parseBirthMonthDay(person.birthDate);
    if (!birth) return null;

    const calendarId = await getOrCreateBirthdayCalendarId();
    if (!calendarId) return null;

    const start = nextBirthdayDate(birth.month, birth.day);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const eventId = await Calendar.createEventAsync(calendarId, {
      title: `${person.fullName}'s Birthday`,
      notes: person.notes ?? 'BirthdayBuddy reminder',
      startDate: start,
      endDate: end,
      allDay: true,
      recurrenceRule: {
        frequency: Calendar.Frequency.YEARLY,
      },
    });

    const map = await loadEventMap();
    map[person.id] = eventId;
    await saveEventMap(map);
    return eventId;
  }

  async updateBirthdayEvent(person: Person, options?: CalendarSyncOptions): Promise<string | null> {
    await this.deleteBirthdayEvent(person.id);
    return this.addBirthdayEvent(person, options);
  }

  async deleteBirthdayEvent(personId: string): Promise<void> {
    const map = await loadEventMap();
    const eventId = map[personId];
    if (!eventId) return;

    try {
      await Calendar.deleteEventAsync(eventId);
    } catch {
      /* event may already be removed */
    }

    delete map[personId];
    await saveEventMap(map);
  }

  async syncAllBirthdays(options?: CalendarSyncOptions): Promise<CalendarSyncResult> {
    const force = options?.force ?? false;

    if (Platform.OS === 'web') {
      return { synced: 0, skipped: 0, failed: 0, error: 'no_calendar' };
    }

    const granted = await this.requestPermissions();
    if (!granted) {
      return { synced: 0, skipped: 0, failed: 0, error: 'permission_denied' };
    }

    const people = await birthdayService.getAllPeople();
    if (people.length === 0) {
      return { synced: 0, skipped: 0, failed: 0, error: 'no_birthdays' };
    }

    let synced = 0;
    let skipped = 0;
    let failed = 0;

    for (const person of people) {
      if (!parseBirthMonthDay(person.birthDate)) {
        skipped += 1;
        continue;
      }
      try {
        const id = await this.updateBirthdayEvent(person, { force });
        if (id) synced += 1;
        else failed += 1;
      } catch {
        failed += 1;
      }
    }

    return { synced, skipped, failed };
  }
}

export const deviceCalendarService = new DeviceCalendarService();

export async function syncPersonToDeviceCalendar(person: Person): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await deviceCalendarService.updateBirthdayEvent(person);
  } catch {
    /* calendar sync is best-effort */
  }
}

export async function removePersonFromDeviceCalendar(personId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await deviceCalendarService.deleteBirthdayEvent(personId);
  } catch {
    /* calendar sync is best-effort */
  }
}

export async function syncDeviceCalendarIfEnabled(): Promise<CalendarSyncResult | null> {
  if (Platform.OS === 'web') return null;
  if (!(await isCalendarSyncEnabled())) return null;
  return deviceCalendarService.syncAllBirthdays();
}
