import type { EventType } from '../types';

export const EVENT_TYPE_CONFIG: Record<
  EventType,
  { label: string; color: string; dotClass: string; badgeClass: string }
> = {
  birthday: {
    label: 'Birthday',
    color: '#7C3AED',
    dotClass: 'bg-primary',
    badgeClass: 'bg-primary',
  },
  anniversary: {
    label: 'Anniversary',
    color: '#22C55E',
    dotClass: 'bg-success',
    badgeClass: 'bg-success',
  },
  special: {
    label: 'Special Day',
    color: '#EC4899',
    dotClass: 'bg-secondary',
    badgeClass: 'bg-secondary',
  },
  custom: {
    label: 'Custom Event',
    color: '#F59E0B',
    dotClass: 'bg-accent-gold',
    badgeClass: 'bg-accent-gold',
  },
};

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
