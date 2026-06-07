import type { ReminderEntry, ReminderSettings } from '../types';
import { generateUuidSync } from '@/utils/uuid';

export const PRESET_DAYS_BEFORE = [0, 3, 7, 10, 15] as const;

export function formatDaysBeforeLabel(daysBefore: number): string {
  if (daysBefore === 0) return 'Same Day';
  if (daysBefore === 1) return '1 Day Before';
  return `${daysBefore} Days Before`;
}

export function formatReminderTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function createReminderEntry(daysBefore: number, time: string): ReminderEntry {
  return { id: generateUuidSync(), daysBefore, time };
}

export function normalizeReminderSettings(settings: ReminderSettings): ReminderSettings {
  if (settings.reminderEntries?.length) {
    const entries = settings.reminderEntries;
    const days = [...new Set(entries.map((e) => e.daysBefore))].sort((a, b) => b - a);
    const times = [...new Set(entries.map((e) => e.time))];
    return {
      ...settings,
      reminderEntries: entries,
      reminderDaysBefore: days,
      multipleReminderTimes: times,
      defaultTime: entries[0]?.time ?? settings.defaultTime,
      timingMode: 'flexible',
    };
  }

  const offsets = settings.reminderDaysBefore.length
    ? settings.reminderDaysBefore
    : [7, 3, 1, 0];
  const times =
    settings.multipleReminderTimes.length > 0
      ? settings.multipleReminderTimes
      : [settings.defaultTime];

  const entries: ReminderEntry[] = offsets.flatMap((daysBefore) =>
    times.map((time) => createReminderEntry(daysBefore, time)),
  );

  return {
    ...settings,
    reminderEntries: entries,
    reminderDaysBefore: offsets,
    multipleReminderTimes: times,
    timingMode: 'flexible',
  };
}

export function summarizeReminderSettings(settings: ReminderSettings): string {
  const normalized = normalizeReminderSettings(settings);
  const count = normalized.reminderEntries.length;
  if (count === 0) return 'Not set';
  if (count === 1) {
    const entry = normalized.reminderEntries[0]!;
    return `${formatDaysBeforeLabel(entry.daysBefore)} · ${formatReminderTime(entry.time)}`;
  }
  return `${count} reminders`;
}
