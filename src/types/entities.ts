import { z } from 'zod';

export const syncStatusSchema = z.enum(['pending', 'synced', 'conflict', 'failed']);
export type SyncStatus = z.infer<typeof syncStatusSchema>;

export const genderSchema = z.enum(['male', 'female', 'other']);
export type Gender = z.infer<typeof genderSchema>;

export const relationshipSchema = z.enum([
  'friend',
  'family',
  'colleague',
  'partner',
  'relative',
]);
export type RelationshipType = z.infer<typeof relationshipSchema>;

export const eventTypeSchema = z.enum([
  'birthday',
  'anniversary',
  'wedding_anniversary',
  'custom',
]);
export type EventType = z.infer<typeof eventTypeSchema>;

export interface Person {
  id: string;
  fullName: string;
  nickname?: string;
  gender: Gender;
  birthDate: string;
  relationship: RelationshipType;
  phone?: string;
  email?: string;
  favoriteColor?: string;
  favoriteCake?: string;
  hobbies: string[];
  notes?: string;
  avatarUri?: string;
  reminderDaysBefore: number;
  reminderTime: string;
  repeatYearly: boolean;
  eventType: EventType;
  customEventName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonInput {
  fullName: string;
  nickname?: string;
  gender: Gender;
  birthDate: string;
  relationship: RelationshipType;
  phone?: string;
  email?: string;
  favoriteColor?: string;
  favoriteCake?: string;
  hobbies?: string[];
  notes?: string;
  avatarUri?: string;
  reminderDaysBefore?: number;
  reminderTime?: string;
  repeatYearly?: boolean;
  eventType?: EventType;
  customEventName?: string;
}

export interface UpdatePersonInput extends Partial<CreatePersonInput> {
  id: string;
}

export interface AiWish {
  id: string;
  personId: string;
  tone?: string;
  language?: string;
  wishText: string;
  generatedSource: string;
  favorite: boolean;
  createdAt: string;
}

export interface CardRecord {
  id: string;
  personId?: string;
  templateId?: string;
  cardJson: string;
  thumbnailUri?: string;
  exportUri?: string;
  favorite: boolean;
  createdAt: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  category: string;
  previewUri?: string;
  templateJson: string;
  isPremium: boolean;
  tags: string[];
}

export interface SearchResult {
  entityType: string;
  entityUuid: string;
  title: string;
  body: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  reminderTime: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  notificationsEnabled: boolean;
  backupAuto: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'en',
  currency: 'USD',
  reminderTime: '08:00',
  notificationsEnabled: true,
  backupAuto: false,
};
