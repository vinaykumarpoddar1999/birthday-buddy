import type { CalendarDayEvent, CalendarMonthConfig, UpcomingEvent } from '../types';

export const calendarMonthConfig: CalendarMonthConfig = {
  year: 2025,
  month: 5,
  monthLabel: 'May 2025',
  shortMonthLabel: 'May',
};

export const calendarEvents: Record<number, CalendarDayEvent[]> = {
  3: [{ id: 'e-3-1', type: 'birthday', avatarVariant: 'user' }],
  5: [
    { id: 'e-5-1', type: 'anniversary', avatarVariant: 'female' },
    { id: 'e-5-2', type: 'special', avatarVariant: 'user' },
  ],
  8: [{ id: 'e-8-1', type: 'custom', avatarVariant: 'user' }],
  10: [{ id: 'e-10-1', type: 'birthday', avatarVariant: 'female' }],
  12: [{ id: 'e-12-1', type: 'anniversary', avatarVariant: 'user' }],
  14: [
    { id: 'e-14-1', type: 'birthday', avatarVariant: 'user' },
    { id: 'e-14-2', type: 'special', avatarVariant: 'female' },
  ],
  16: [{ id: 'e-16-1', type: 'anniversary', avatarVariant: 'female' }],
  19: [{ id: 'e-19-1', type: 'birthday', avatarVariant: 'user' }],
  20: [{ id: 'e-20-1', type: 'custom', avatarVariant: 'user' }],
  22: [
    { id: 'e-22-1', type: 'special', avatarVariant: 'female' },
    { id: 'e-22-2', type: 'birthday', avatarVariant: 'user' },
  ],
  25: [{ id: 'e-25-1', type: 'birthday', avatarVariant: 'female' }],
  28: [{ id: 'e-28-1', type: 'special', avatarVariant: 'user' }],
  30: [{ id: 'e-30-1', type: 'custom', avatarVariant: 'female' }],
};

export const dotOnlyDates: Record<number, ('birthday' | 'custom')[]> = {
  7: ['birthday'],
  17: ['custom'],
  24: ['birthday', 'custom'],
};

export const defaultSelectedDate = 14;

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: 'up-1',
    day: 14,
    weekday: 'WED',
    month: 'MAY',
    name: 'Rahul Sharma',
    description: 'Turns 29 · Birthday',
    countdown: 'In 2 Days',
    type: 'birthday',
    avatarVariant: 'user',
    cardTint: 'bg-violet-50',
    primaryAction: { label: 'Send Wish', icon: 'send' },
    secondaryAction: { label: 'Gift Ideas', icon: 'gift' },
  },
  {
    id: 'up-2',
    day: 16,
    weekday: 'FRI',
    month: 'MAY',
    name: 'Ananya Mehta',
    description: 'Wedding Anniversary',
    countdown: 'In 4 Days',
    type: 'anniversary',
    avatarVariant: 'female',
    cardTint: 'bg-emerald-50',
    primaryAction: { label: 'Send Wish', icon: 'send' },
    secondaryAction: { label: 'Plan Surprise', icon: 'wand' },
  },
  {
    id: 'up-3',
    day: 19,
    weekday: 'MON',
    month: 'MAY',
    name: 'Vikram Joshi',
    description: 'Turns 31 · Birthday',
    countdown: 'In 7 Days',
    type: 'birthday',
    avatarVariant: 'user',
    cardTint: 'bg-violet-50',
    primaryAction: { label: 'Send Wish', icon: 'send' },
    secondaryAction: { label: 'Gift Ideas', icon: 'gift' },
  },
  {
    id: 'up-4',
    day: 22,
    weekday: 'THU',
    month: 'MAY',
    name: 'Neha Kapoor',
    description: 'Special Day',
    countdown: 'In 10 Days',
    type: 'special',
    avatarVariant: 'female',
    cardTint: 'bg-amber-50',
    primaryAction: { label: 'Send Wish', icon: 'send' },
    secondaryAction: { label: 'Create Card', icon: 'card' },
  },
];
