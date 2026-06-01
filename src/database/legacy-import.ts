import AsyncStorage from '@react-native-async-storage/async-storage';

import { DatabaseManager } from './database-manager';
import { peopleRepository } from '@/repositories/people.repository';
import { eventRepository } from '@/repositories/event.repository';
import { settingsRepository } from '@/repositories/settings.repository';
import type { CreatePersonInput, EventType, Gender, RelationshipType } from '@/types/entities';

const LEGACY_STORAGE_KEY = 'birthday-buddy-people-v1';

interface LegacyStoredPerson {
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
  profileImage?: string;
  reminderDaysBefore: number;
  reminderTime: string;
  repeatYearly: boolean;
  eventType: string;
}

async function importPerson(
  data: CreatePersonInput & { legacyId?: string },
): Promise<void> {
  const legacyUuid = data.legacyId;
  const uuid = await peopleRepository.insert(data, legacyUuid);
  const personId = await peopleRepository.getInternalId(uuid);
  if (personId) {
    await eventRepository.insertForPerson(personId, data);
  }
}

function mapLegacyPerson(p: LegacyStoredPerson): CreatePersonInput & { legacyId: string } {
  const eventTypeMap: Record<string, EventType> = {
    birthday: 'birthday',
    anniversary: 'anniversary',
    wedding: 'wedding_anniversary',
    custom: 'custom',
  };
  return {
    legacyId: p.id,
    fullName: p.fullName,
    nickname: p.nickname,
    gender: p.gender,
    birthDate: p.birthDate,
    relationship: p.relationship,
    phone: p.phone,
    email: p.email,
    favoriteColor: p.favoriteColor,
    favoriteCake: p.favoriteCake,
    hobbies: p.hobbies,
    notes: p.notes,
    avatarUri: p.profileImage,
    reminderDaysBefore: p.reminderDaysBefore,
    reminderTime: p.reminderTime,
    repeatYearly: p.repeatYearly,
    eventType: eventTypeMap[p.eventType] ?? 'birthday',
  };
}

export async function runLegacyImport(_manager: typeof DatabaseManager): Promise<void> {
  if (await settingsRepository.hasLegacyImportDone()) return;

  const raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { state?: { people?: LegacyStoredPerson[] } };
      const people = parsed.state?.people ?? [];
      await DatabaseManager.withTransaction(async () => {
        for (const p of people) {
          await importPerson(mapLegacyPerson(p));
        }
      });
      await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      /* ignore corrupt legacy payload */
    }
  }

  await settingsRepository.markLegacyImportDone();
}
