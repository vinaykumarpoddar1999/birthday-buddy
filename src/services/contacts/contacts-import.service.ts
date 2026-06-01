import * as Contacts from 'expo-contacts';

import { peopleService } from '@/services/people/people.service';
import type { CreatePersonInput } from '@/types/entities';

export type ContactImportResult = {
  imported: number;
  skipped: number;
  total: number;
};

function formatBirthDate(contact: Contacts.Contact): string | null {
  if (!contact.birthday) return null;
  const { year, month, day } = contact.birthday;
  if (month == null || day == null) return null;
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  if (year != null) return `${year}-${m}-${d}`;
  return `2000-${m}-${d}`;
}

function buildName(contact: Contacts.Contact): string {
  if (contact.name) return contact.name.trim();
  const parts = [contact.firstName, contact.lastName].filter(Boolean);
  return parts.join(' ').trim();
}

export async function importContactsFromDevice(): Promise<ContactImportResult> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Contacts permission is required to import birthdays.');
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [
      Contacts.Fields.Name,
      Contacts.Fields.FirstName,
      Contacts.Fields.LastName,
      Contacts.Fields.Birthday,
      Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails,
      Contacts.Fields.Image,
    ],
  });

  const existing = await peopleService.list(2000, 0);
  const existingNames = new Set(existing.map((p) => p.fullName.toLowerCase().trim()));

  let imported = 0;
  let skipped = 0;

  for (const contact of data) {
    const birthDate = formatBirthDate(contact);
    const fullName = buildName(contact);
    if (!birthDate || !fullName) {
      skipped += 1;
      continue;
    }

    const key = fullName.toLowerCase();
    if (existingNames.has(key)) {
      skipped += 1;
      continue;
    }

    const input: CreatePersonInput = {
      fullName,
      birthDate,
      gender: 'other',
      relationship: 'friend',
      phone: contact.phoneNumbers?.[0]?.number,
      email: contact.emails?.[0]?.email,
      avatarUri: contact.imageAvailable ? contact.image?.uri : undefined,
      reminderDaysBefore: 3,
      reminderTime: '08:00',
      repeatYearly: true,
      eventType: 'birthday',
    };

    await peopleService.create(input);
    existingNames.add(key);
    imported += 1;
  }

  return { imported, skipped, total: data.length };
}
