import type { ProfilePlaceholderVariant } from '@shared/ui/ProfilePlaceholder';

export type CalendarViewMode = 'month' | 'timeline' | 'list';

export type EventType = 'birthday' | 'anniversary' | 'special' | 'custom';

export type CalendarDayEvent = {
  id: string;
  type: EventType;
  personId?: string;
  avatarVariant: ProfilePlaceholderVariant;
};

export type CalendarMonthConfig = {
  year: number;
  month: number;
  monthLabel: string;
  shortMonthLabel: string;
};

export type UpcomingEventActionIcon =
  | 'send'
  | 'gift'
  | 'wand'
  | 'card'
  | 'sparkles';

export type UpcomingEventAction = {
  label: string;
  icon: UpcomingEventActionIcon;
};

export type UpcomingEvent = {
  id: string;
  personId?: string;
  day: number;
  weekday: string;
  month: string;
  name: string;
  description: string;
  countdown: string;
  type: EventType;
  avatarVariant: ProfilePlaceholderVariant;
  cardTint: string;
  primaryAction: UpcomingEventAction;
  secondaryAction: UpcomingEventAction;
};
