import * as Contacts from 'expo-contacts';

import { peopleService } from '@/services/people/people.service';
import type { DeviceContactPreview } from '@/stores/contacts.store';
import type { CreatePersonInput, Person } from '@/types/entities';

export type ContactImportResult = {
  imported: number;
  skipped: number;
  total: number;
};

export type DuplicateMatch = {
  isDuplicate: boolean;
  existingPersonId?: string;
};

const CONTACT_FIELDS = [
  Contacts.Fields.Name,
  Contacts.Fields.FirstName,
  Contacts.Fields.LastName,
  Contacts.Fields.Birthday,
  Contacts.Fields.PhoneNumbers,
  Contacts.Fields.Emails,
  Contacts.Fields.Image,
] as const;

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

function normalizePhone(phone?: string): string | undefined {
  const digits = phone?.replace(/\D/g, '');
  return digits && digits.length > 0 ? digits : undefined;
}

function normalizeEmail(email?: string): string | undefined {
  const trimmed = email?.trim().toLowerCase();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

export function detectDuplicates(
  fullName: string,
  existingPeople: Person[],
  options?: { phone?: string; email?: string },
): DuplicateMatch {
  const nameKey = fullName.toLowerCase().trim();
  const phoneKey = normalizePhone(options?.phone);
  const emailKey = normalizeEmail(options?.email);

  for (const person of existingPeople) {
    if (person.fullName.toLowerCase().trim() === nameKey) {
      return { isDuplicate: true, existingPersonId: person.id };
    }
    const existingPhone = normalizePhone(person.phone);
    if (phoneKey && existingPhone && phoneKey === existingPhone) {
      return { isDuplicate: true, existingPersonId: person.id };
    }
    const existingEmail = normalizeEmail(person.email);
    if (emailKey && existingEmail && emailKey === existingEmail) {
      return { isDuplicate: true, existingPersonId: person.id };
    }
  }

  return { isDuplicate: false };
}

function contactId(contact: Contacts.Contact, fullName: string, birthDate: string | null): string {
  const deviceId = (contact as Contacts.Contact & { id?: string }).id;
  if (deviceId) return deviceId;
  return `${fullName}-${birthDate ?? 'none'}-${contact.phoneNumbers?.[0]?.number ?? ''}`;
}

function toCreateInput(
  contact: Contacts.Contact,
  fullName: string,
  birthDate: string,
): CreatePersonInput {
  return {
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
}

export async function listDeviceContacts(): Promise<DeviceContactPreview[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Contacts permission is required to import birthdays.');
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [...CONTACT_FIELDS],
  });

  const existing = await peopleService.list(2000, 0);

  return data
    .map((contact) => {
      const fullName = buildName(contact);
      const birthDate = formatBirthDate(contact);
      const phone = contact.phoneNumbers?.[0]?.number;
      const email = contact.emails?.[0]?.email;
      const { isDuplicate } = detectDuplicates(fullName, existing, { phone, email });

      return {
        id: contactId(contact, fullName, birthDate),
        fullName,
        birthDate,
        phone,
        email,
        avatarUri: contact.imageAvailable ? contact.image?.uri : undefined,
        isDuplicate,
        selected: Boolean(birthDate) && !isDuplicate,
      };
    })
    .filter((contact) => contact.fullName.length > 0)
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function importSelectedContacts(
  ids: string[],
  mergeDuplicates = false,
): Promise<ContactImportResult> {
  if (ids.length === 0) {
    return { imported: 0, skipped: 0, total: 0 };
  }

  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Contacts permission is required to import birthdays.');
  }

  const idSet = new Set(ids);
  const { data } = await Contacts.getContactsAsync({
    fields: [...CONTACT_FIELDS],
  });

  const existing = await peopleService.list(2000, 0);
  const existingNames = new Set(existing.map((p) => p.fullName.toLowerCase().trim()));

  let imported = 0;
  let skipped = 0;

  for (const contact of data) {
    const fullName = buildName(contact);
    const birthDate = formatBirthDate(contact);
    const id = contactId(contact, fullName, birthDate);

    if (!idSet.has(id)) continue;

    const phone = contact.phoneNumbers?.[0]?.number;
    const email = contact.emails?.[0]?.email;

    if (!birthDate || !fullName) {
      skipped += 1;
      continue;
    }

    const duplicate = detectDuplicates(fullName, existing, { phone, email });

    if (duplicate.isDuplicate) {
      if (mergeDuplicates && duplicate.existingPersonId) {
        await peopleService.update({
          id: duplicate.existingPersonId,
          phone: phone ?? undefined,
          email: email ?? undefined,
          birthDate,
        });
        imported += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    await peopleService.create(toCreateInput(contact, fullName, birthDate));
    existingNames.add(fullName.toLowerCase());
    imported += 1;
  }

  return { imported, skipped, total: ids.length };
}

export async function importContactsFromDevice(): Promise<ContactImportResult> {
  const contacts = await listDeviceContacts();
  const ids = contacts.filter((c) => c.birthDate && c.selected).map((c) => c.id);
  return importSelectedContacts(ids);
}
