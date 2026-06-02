import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';
import { birthdayService } from '@/services/birthday/birthday.service';
import { parseBirthMonthDay } from '@/services/notifications/local-notifications.service';
import type { Person } from '@/types/entities';

const DEVICE_CALENDAR_EVENT_MAP_KEY = 'device_calendar_event_map';

type EventMap = Record<string, string>;

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

async function resolveDefaultCalendarId(): Promise<string | null> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find((c) => c.allowsModifications);
  if (writable) return writable.id;

  if (Platform.OS === 'ios') {
    const defaultCal = await Calendar.getDefaultCalendarAsync();
    return defaultCal?.id ?? null;
  }

  return calendars[0]?.id ?? null;
}

export class DeviceCalendarService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  }

  async addBirthdayEvent(person: Person): Promise<string | null> {
    const granted = await this.requestPermissions();
    if (!granted) return null;

    const birth = parseBirthMonthDay(person.birthDate);
    if (!birth) return null;

    const calendarId = await resolveDefaultCalendarId();
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

  async updateBirthdayEvent(person: Person): Promise<string | null> {
    await this.deleteBirthdayEvent(person.id);
    return this.addBirthdayEvent(person);
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

  async syncAllBirthdays(): Promise<{ synced: number; skipped: number }> {
    const granted = await this.requestPermissions();
    if (!granted) {
      return { synced: 0, skipped: 0 };
    }

    const people = await birthdayService.getAllPeople();
    let synced = 0;
    let skipped = 0;

    for (const person of people) {
      if (!parseBirthMonthDay(person.birthDate)) {
        skipped += 1;
        continue;
      }
      const id = await this.updateBirthdayEvent(person);
      if (id) synced += 1;
      else skipped += 1;
    }

    return { synced, skipped };
  }
}

export const deviceCalendarService = new DeviceCalendarService();
