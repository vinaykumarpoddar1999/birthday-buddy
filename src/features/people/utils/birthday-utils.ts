import { differenceInDays, format } from 'date-fns';

import type { StoredPerson } from '@store/people.store';
import type { CalendarDayEvent, UpcomingEvent } from '@features/calendar/types';
import type { ProfilePlaceholderVariant } from '@shared/ui/ProfilePlaceholder';
import type { BirthdayEvent, Contact, EventState } from '../types';

// ─── Core date helpers ────────────────────────────────────────────────────────

export function getNextBirthdayDate(birthDate: string): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = new Date(birthDate);
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  return next;
}

export function getDaysUntilBirthday(birthDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next = getNextBirthdayDate(birthDate);
  return differenceInDays(next, today);
}

export function getAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function getAgeAtNextBirthday(birthDate: string): number {
  const birth = new Date(birthDate);
  const next = getNextBirthdayDate(birthDate);
  return next.getFullYear() - birth.getFullYear();
}

export function formatBirthdayShort(birthDate: string): string {
  const birth = new Date(birthDate);
  return format(new Date(new Date().getFullYear(), birth.getMonth(), birth.getDate()), 'd MMM');
}

export function getCountdownLabel(days: number): string {
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow';
  return `In ${days} Days`;
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

export function sortByUpcoming(people: StoredPerson[]): StoredPerson[] {
  return [...people].sort(
    (a, b) => getDaysUntilBirthday(a.birthDate) - getDaysUntilBirthday(b.birthDate),
  );
}

export function getUpcomingPeople(people: StoredPerson[], limit?: number): StoredPerson[] {
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

export function toHomeUpcomingCard(person: StoredPerson, index: number): HomeUpcomingCardData {
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

export function toBirthdayEvent(person: StoredPerson): BirthdayEvent {
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
    eventLabel: days === 0 ? `Today, ${monthName}` : days === 1 ? `Tomorrow, ${monthName}` : `In ${days} days, ${monthName}`,
    eventState: getEventState(days),
  };
}

export function toContact(person: StoredPerson): Contact {
  const birth = new Date(person.birthDate);
  return {
    id: person.id,
    name: person.fullName,
    phone: person.phone ?? '',
    email: person.email ?? '',
    relationship: person.relationship,
    birthday: formatBirthdayShort(person.birthDate),
    birthdayLabel: format(new Date(new Date().getFullYear(), birth.getMonth(), birth.getDate()), 'd MMM'),
    age: getAge(person.birthDate),
    gender: person.gender === 'other' ? 'male' : person.gender,
  };
}

// ─── Calendar events ──────────────────────────────────────────────────────────

export function getBirthdayCalendarEvents(
  people: StoredPerson[],
  month: number,
): Record<number, CalendarDayEvent[]> {
  const events: Record<number, CalendarDayEvent[]> = {};
  for (const person of people) {
    const birth = new Date(person.birthDate);
    if (birth.getMonth() + 1 === month) {
      const day = birth.getDate();
      if (!events[day]) events[day] = [];
      events[day].push({
        id: `bd-${person.id}`,
        type: 'birthday',
        avatarVariant: person.gender === 'female' ? 'female' : 'user',
      });
    }
  }
  return events;
}

const MONTH_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const WEEKDAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function getCalendarUpcomingEvents(
  people: StoredPerson[],
  year: number,
  month: number,
): UpcomingEvent[] {
  return people
    .filter((p) => new Date(p.birthDate).getMonth() + 1 === month)
    .sort((a, b) => new Date(a.birthDate).getDate() - new Date(b.birthDate).getDate())
    .map((person) => {
      const birth = new Date(person.birthDate);
      const day = birth.getDate();
      const birthdayDate = new Date(year, birth.getMonth(), day);
      const days = getDaysUntilBirthday(person.birthDate);
      const ageAtBirthday = getAgeAtNextBirthday(person.birthDate);
      return {
        id: `upcoming-${person.id}-${year}`,
        day,
        weekday: WEEKDAY_SHORT[birthdayDate.getDay()],
        month: MONTH_SHORT[birth.getMonth()],
        name: person.fullName,
        description: `Turns ${ageAtBirthday} · Birthday`,
        countdown: getCountdownLabel(days),
        type: 'birthday' as const,
        avatarVariant: (person.gender === 'female' ? 'female' : 'user') as ProfilePlaceholderVariant,
        cardTint: 'bg-violet-50',
        primaryAction: { label: 'Send Wish', icon: 'send' as const },
        secondaryAction: { label: 'Gift Ideas', icon: 'gift' as const },
      };
    });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export type BirthdayStats = {
  todayCount: number;
  upcoming30Count: number;
  totalCount: number;
};

export function getBirthdayStats(people: StoredPerson[]): BirthdayStats {
  let todayCount = 0;
  let upcoming30Count = 0;
  for (const p of people) {
    const days = getDaysUntilBirthday(p.birthDate);
    if (days === 0) todayCount++;
    if (days > 0 && days <= 30) upcoming30Count++;
  }
  return { todayCount, upcoming30Count, totalCount: people.length };
}
