import type { LucideIcon } from 'lucide-react-native';

export type RelationshipType = 'friend' | 'family' | 'colleague' | 'partner' | 'relative';

export type ContactAction = 'call' | 'message' | 'gift' | 'wish' | 'more';

export type CategoryId = 'all' | 'friend' | 'family' | 'colleague' | 'other';

export type SortDirection = 'asc' | 'desc';

export type EventState = 'tomorrow' | 'in2days' | 'in3days' | 'in5days' | 'in7days' | 'in10days';

export type Gender = 'male' | 'female';

export interface Person {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: RelationshipType;
  birthday: string;
  age: number;
  gender: Gender;
}

export interface BirthdayEvent extends Person {
  eventLabel: string;
  eventState: EventState;
}

export interface Contact extends Person {
  birthdayLabel: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  count: number;
  icon: LucideIcon;
}
