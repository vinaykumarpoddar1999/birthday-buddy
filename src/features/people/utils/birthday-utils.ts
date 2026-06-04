import { differenceInDays, format } from 'date-fns';

import type { Person } from '@/types/entities';
import type { CalendarDayEvent, UpcomingEvent } from '@features/calendar/types';
import type { ProfilePlaceholderVariant } from '@shared/ui/ProfilePlaceholder';
import type { BirthdayEvent, Contact, EventState } from '../types';

// ─── Core date helpers ────────────────────────────────────────────────────────

/** Parse YYYY-MM-DD without UTC timezone drift. */
export function parseBirthDateParts(birthDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = birthDate.split('-').map(Number);
  return { year, month, day };
}

export function getNextBirthdayDate(birthDate: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { month, day } = parseBirthDateParts(birthDate);
  let next = new Date(today.getFullYear(), month - 1, day);
  if (next < today) {
    next = new Date(today.getFullYear() + 1, month - 1, day);
  }
  return next;
}

export function getDaysUntilBirthday(birthDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next = getNextBirthdayDate(birthDate);
  return differenceInDays(next, today);
}

/** Days from today until this person's birthday in a specific calendar year. */
export function getDaysUntilBirthdayInYear(birthDate: string, year: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { month, day } = parseBirthDateParts(birthDate);
  let target = new Date(year, month - 1, day);
  if (year === today.getFullYear() && target < today) {
    target = new Date(year + 1, month - 1, day);
  }
  return differenceInDays(target, today);
}

export function getAge(birthDate: string): number {
  const today = new Date();
  const { year, month, day } = parseBirthDateParts(birthDate);
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) age--;
  return age;
}

export function getAgeAtNextBirthday(birthDate: string): number {
  const { year } = parseBirthDateParts(birthDate);
  const next = getNextBirthdayDate(birthDate);
  return next.getFullYear() - year;
}

export function formatBirthdayShort(birthDate: string): string {
  const { month, day } = parseBirthDateParts(birthDate);
  return format(new Date(new Date().getFullYear(), month - 1, day), 'd MMM');
}

export function formatBirthdayLong(birthDate: string): string {
  const { year, month, day } = parseBirthDateParts(birthDate);
  if (!month || !day || Number.isNaN(month) || Number.isNaN(day)) {
    return birthDate || 'Unknown date';
  }
  const safeYear = year && !Number.isNaN(year) ? year : 2000;
  try {
    return format(new Date(safeYear, month - 1, day), 'd MMMM yyyy');
  } catch {
    return birthDate || 'Unknown date';
  }
}

export function safeFormatBirthdayLong(birthDate: string | undefined | null): string {
  if (!birthDate) return 'Not set';
  try {
    return formatBirthdayLong(birthDate);
  } catch {
    return birthDate;
  }
}

export function safeFormatBirthdayShort(birthDate: string | undefined | null): string {
  if (!birthDate) return 'Not set';
  try {
    return formatBirthdayShort(birthDate);
  } catch {
    return birthDate;
  }
}

export function getCountdownLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} Days Left`;
}

export type DetailedCountdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  primaryLabel: string;
  secondaryLabel: string;
  isToday: boolean;
  isPast: boolean;
};

export function getNextBirthdayDateTime(birthDate: string): Date {
  const next = getNextBirthdayDate(birthDate);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Live countdown until the next birthday at midnight local time. */
export function getDetailedCountdown(birthDate: string, now = new Date()): DetailedCountdown {
  const calendarDays = getDaysUntilBirthday(birthDate);
  const target = getNextBirthdayDateTime(birthDate);
  const diffMs = target.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const abs = Math.max(0, diffMs);
  const totalSeconds = Math.floor(abs / 1000);
  const days = calendarDays;
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isToday = calendarDays === 0;

  let primaryLabel: string;
  let secondaryLabel: string;

  if (isToday) {
    primaryLabel = 'Today';
    secondaryLabel = 'Celebrate now!';
  } else if (calendarDays === 1) {
    primaryLabel = 'Tomorrow';
    const remainingHours = Math.max(1, Math.ceil(abs / 3600000));
    secondaryLabel = `${remainingHours} hour${remainingHours === 1 ? '' : 's'} remaining`;
  } else {
    primaryLabel = `${calendarDays} Days Left`;
    secondaryLabel = formatBirthdayShort(birthDate);
  }

  return { days, hours, minutes, seconds, primaryLabel, secondaryLabel, isToday, isPast };
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  friend: 'Friend',
  family: 'Family',
  colleague: 'Colleague',
  partner: 'Partner',
  relative: 'Relative',
};

export function formatRelationship(relationship: string): string {
  return RELATIONSHIP_LABELS[relationship] ?? relationship;
}

export function getBadgeLabel(days: number): string {
  if (days === 0) return 'Today';
  if (days < 99) return `${days}D`;
  return `${Math.round(days / 30)}M`;
}

export function getEventState(days: number): EventState {
  if (days <= 1) return 'tomorrow';
  if (days <= 2) return 'in2days';
  if (days <= 3) return 'in3days';
  if (days <= 5) return 'in5days';
  if (days <= 7) return 'in7days';
  return 'in10days';
}

// ─── Sorting & filtering ──────────────────────────────────────────────────────

export function sortByUpcoming(people: Person[]): Person[] {
  return [...people].sort(
    (a, b) => getDaysUntilBirthday(a.birthDate) - getDaysUntilBirthday(b.birthDate),
  );
}

export function getUpcomingPeople(people: Person[], limit?: number): Person[] {
  const sorted = sortByUpcoming(people);
  return limit ? sorted.slice(0, limit) : sorted;
}

// ─── Transform to existing component types ───────────────────────────────────

const BG_CLASSES = [
  'bg-pastel-lavender',
  'bg-pastel-peach',
  'bg-pastel-mint',
  'bg-pastel-pink',
] as const;

const BADGE_CLASSES = [
  'bg-primary',
  'bg-accent-gold',
  'bg-success',
  'bg-secondary',
] as const;

export type HomeUpcomingCardData = {
  id: string;
  name: string;
  date: string;
  badge: string;
  avatarVariant: ProfilePlaceholderVariant;
  bgClass: string;
  badgeClass: string;
};

export function toHomeUpcomingCard(person: Person, index: number): HomeUpcomingCardData {
  const days = getDaysUntilBirthday(person.birthDate);
  return {
    id: person.id,
    name: person.fullName,
    date: formatBirthdayShort(person.birthDate),
    badge: getBadgeLabel(days),
    avatarVariant: person.gender === 'female' ? 'female' : 'user',
    bgClass: BG_CLASSES[index % BG_CLASSES.length],
    badgeClass: BADGE_CLASSES[index % BADGE_CLASSES.length],
  };
}

export function toBirthdayEvent(person: Person): BirthdayEvent {
  const days = getDaysUntilBirthday(person.birthDate);
  const nextBirthday = getNextBirthdayDate(person.birthDate);
  const monthName = format(nextBirthday, 'd MMM');
  return {
    id: person.id,
    name: person.fullName,
    phone: person.phone ?? '',
    email: person.email ?? '',
    relationship: person.relationship,
    birthday: formatBirthdayShort(person.birthDate),
    age: getAgeAtNextBirthday(person.birthDate),
    gender: person.gender === 'other' ? 'male' : person.gender,
    avatarUri: person.avatarUri,
    eventLabel: days === 0 ? `Today, ${monthName}` : days === 1 ? `Tomorrow, ${monthName}` : `In ${days} days, ${monthName}`,
    eventState: getEventState(days),
  };
}

export function toContact(person: Person): Contact {
  const { month, day } = parseBirthDateParts(person.birthDate);
  return {
    id: person.id,
    name: person.fullName,
    phone: person.phone ?? '',
    email: person.email ?? '',
    relationship: person.relationship,
    birthday: formatBirthdayShort(person.birthDate),
    birthdayLabel: format(new Date(new Date().getFullYear(), month - 1, day), 'd MMM'),
    age: getAge(person.birthDate),
    gender: person.gender === 'other' ? 'male' : person.gender,
    avatarUri: person.avatarUri,
  };
}

// ─── Calendar events ──────────────────────────────────────────────────────────

export function getBirthdayCalendarEvents(
  people: Person[],
  month: number,
): Record<number, CalendarDayEvent[]> {
  const events: Record<number, CalendarDayEvent[]> = {};
  for (const person of people) {
    const { month: birthMonth, day } = parseBirthDateParts(person.birthDate);
    if (birthMonth === month) {
      if (!events[day]) events[day] = [];
      events[day].push({
        id: `bd-${person.id}`,
        type: 'birthday',
        personId: person.id,
        name: person.fullName,
        avatarVariant: person.gender === 'female' ? 'female' : 'user',
        avatarUri: person.avatarUri,
        gender: person.gender,
      });
    }
  }
  return events;
}

export function getPeopleForCalendarDay(
  people: Person[],
  month: number,
  day: number,
): Person[] {
  return people.filter((person) => {
    try {
      const parts = parseBirthDateParts(person.birthDate);
      return parts.month === month && parts.day === day;
    } catch {
      return false;
    }
  });
}

export function resolvePeopleForCalendarDay(
  people: Person[],
  month: number,
  day: number,
  dayEvents: CalendarDayEvent[] = [],
): Person[] {
  const fromBirthdays = getPeopleForCalendarDay(people, month, day);
  if (fromBirthdays.length > 0) return fromBirthdays;

  const eventPersonIds = [...new Set(dayEvents.map((e) => e.personId).filter(Boolean))] as string[];
  if (eventPersonIds.length === 0) return [];

  const fromEvents = eventPersonIds
    .map((id) => people.find((p) => p.id === id))
    .filter((p): p is Person => Boolean(p));

  return fromEvents.length > 0 ? fromEvents : [];
}

export function getPrimaryPersonIdForCalendarDay(
  people: Person[],
  month: number,
  day: number,
  dayEvents: CalendarDayEvent[] = [],
): string | null {
  const resolved = resolvePeopleForCalendarDay(people, month, day, dayEvents);
  if (resolved.length === 1) return resolved[0].id;

  const eventIds = dayEvents.map((e) => e.personId).filter(Boolean) as string[];
  if (eventIds.length === 1) return eventIds[0] ?? null;

  return null;
}

const MONTH_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function getCalendarUpcomingEvents(
  people: Person[],
  year: number,
  month: number,
): UpcomingEvent[] {
  return people
    .filter((p) => parseBirthDateParts(p.birthDate).month === month)
    .sort(
      (a, b) =>
        parseBirthDateParts(a.birthDate).day - parseBirthDateParts(b.birthDate).day,
    )
    .map((person) => {
      const { month: birthMonth, day } = parseBirthDateParts(person.birthDate);
      const birthdayDate = new Date(year, birthMonth - 1, day);
      const days = getDaysUntilBirthdayInYear(person.birthDate, year);
      const ageAtBirthday = getAgeAtNextBirthday(person.birthDate);
      return {
        id: `upcoming-${person.id}-${year}`,
        personId: person.id,
        day,
        weekday: WEEKDAY_SHORT[birthdayDate.getDay()],
        month: MONTH_SHORT[birthMonth - 1],
        name: person.fullName,
        description: `Turns ${ageAtBirthday} · Birthday`,
        countdown: getCountdownLabel(Math.max(0, days)),
        type: 'birthday' as const,
        avatarVariant: (person.gender === 'female' ? 'female' : 'user') as ProfilePlaceholderVariant,
        avatarUri: person.avatarUri,
        gender: person.gender,
        cardTint: 'bg-violet-50',
        primaryAction: { label: 'Send Wish', icon: 'send' as const },
        secondaryAction: { label: 'Create Card', icon: 'card' as const },
      };
    });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export type BirthdayStats = {
  todayCount: number;
  upcoming30Count: number;
  totalCount: number;
};

export function getBirthdayStats(people: Person[]): BirthdayStats {
  let todayCount = 0;
  let upcoming30Count = 0;
  for (const p of people) {
    const days = getDaysUntilBirthday(p.birthDate);
    if (days === 0) todayCount++;
    if (days > 0 && days <= 30) upcoming30Count++;
  }
  return { todayCount, upcoming30Count, totalCount: people.length };
}
