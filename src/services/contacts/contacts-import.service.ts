import * as Contacts from 'expo-contacts';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import { peopleService } from '@/services/people/people.service';
import type { DeviceContactPreview } from '@/stores/contacts.store';
import type { CreatePersonInput, Person } from '@/types/entities';

export type ContactImportResult = {
  imported: number;
  skipped: number;
  total: number;
  personIds?: string[];
};

export type PickedContact = {
  fullName: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  avatarUri?: string;
  deviceContactId?: string;
};

export type DuplicateMatch = {
  isDuplicate: boolean;
  existingPersonId?: string;
};

/** Placeholder until user completes details in the queue flow. */
export const PLACEHOLDER_BIRTH_DATE = '2000-01-01';

export function isPlaceholderBirthDate(birthDate: string | undefined | null): boolean {
  return !birthDate || birthDate === PLACEHOLDER_BIRTH_DATE;
}

const LIST_CONTACT_FIELDS = [
  Contacts.Fields.Name,
  Contacts.Fields.FirstName,
  Contacts.Fields.LastName,
  Contacts.Fields.Birthday,
  Contacts.Fields.PhoneNumbers,
  Contacts.Fields.Emails,
] as const;

const IMAGE_FIELD = [Contacts.Fields.Image] as const;

let cachedContacts: Contacts.Contact[] | null = null;
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export function invalidateContactsCache(): void {
  cachedContacts = null;
  cacheLoadedAt = 0;
}

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
  avatarUri?: string,
): CreatePersonInput {
  return {
    fullName,
    birthDate,
    gender: 'other',
    relationship: 'friend',
    phone: contact.phoneNumbers?.[0]?.number,
    email: contact.emails?.[0]?.email,
    avatarUri,
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
  };
}

function toMinimalCreateInput(picked: PickedContact, avatarUri?: string): CreatePersonInput {
  return {
    fullName: picked.fullName,
    birthDate: picked.birthDate ?? PLACEHOLDER_BIRTH_DATE,
    gender: 'other',
    relationship: 'friend',
    phone: picked.phone,
    email: picked.email,
    avatarUri,
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
  };
}

export async function persistContactImageUri(uri?: string): Promise<string | undefined> {
  if (!uri) return undefined;
  try {
    const dir = `${FileSystem.documentDirectory}profile/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const dest = `${dir}contact-${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch {
    return uri;
  }
}

export async function fetchContactImageUri(deviceContactId?: string): Promise<string | undefined> {
  if (!deviceContactId) return undefined;
  try {
    const contact = await Contacts.getContactByIdAsync(deviceContactId, [...IMAGE_FIELD]);
    if (contact?.imageAvailable && contact.image?.uri) {
      return persistContactImageUri(contact.image.uri);
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

async function fetchDeviceContacts(force = false): Promise<Contacts.Contact[]> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Contacts permission is required to import birthdays.');
  }

  if (!force && cachedContacts && Date.now() - cacheLoadedAt < CACHE_TTL_MS) {
    return cachedContacts;
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [...LIST_CONTACT_FIELDS],
  });

  cachedContacts = data;
  cacheLoadedAt = Date.now();
  return data;
}

function mapContactToPreview(
  contact: Contacts.Contact,
  existing: Person[],
): DeviceContactPreview {
  const fullName = buildName(contact);
  const birthDate = formatBirthDate(contact);
  const phone = contact.phoneNumbers?.[0]?.number;
  const email = contact.emails?.[0]?.email;
  const { isDuplicate } = detectDuplicates(fullName, existing, { phone, email });
  const deviceId = (contact as Contacts.Contact & { id?: string }).id;

  return {
    id: contactId(contact, fullName, birthDate),
    deviceContactId: deviceId,
    fullName,
    birthDate,
    phone,
    email,
    avatarUri: undefined,
    isDuplicate,
    selected: !isDuplicate,
  };
}

export function contactToPicked(contact: Contacts.Contact): PickedContact | null {
  const fullName = buildName(contact);
  if (!fullName) return null;
  const deviceId = (contact as Contacts.Contact & { id?: string }).id;
  return {
    fullName,
    phone: contact.phoneNumbers?.[0]?.number,
    email: contact.emails?.[0]?.email,
    birthDate: formatBirthDate(contact) ?? undefined,
    avatarUri: contact.imageAvailable ? contact.image?.uri : undefined,
    deviceContactId: deviceId,
  };
}

export async function pickSingleContactNative(): Promise<PickedContact | null> {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Contacts permission is required to pick a contact.');
  }

  if (Platform.OS === 'ios') {
    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) return null;
    const picked = contactToPicked(contact);
    if (!picked) return null;
    if (picked.avatarUri) {
      picked.avatarUri = await persistContactImageUri(picked.avatarUri);
    }
    return picked;
  }

  return null;
}

export async function preparePickedContact(preview: DeviceContactPreview): Promise<PickedContact> {
  let avatarUri = preview.avatarUri;
  if (!avatarUri && preview.deviceContactId) {
    avatarUri = await fetchContactImageUri(preview.deviceContactId);
  } else if (avatarUri) {
    avatarUri = await persistContactImageUri(avatarUri);
  }

  return {
    fullName: preview.fullName,
    phone: preview.phone,
    email: preview.email,
    birthDate: preview.birthDate ?? undefined,
    avatarUri,
    deviceContactId: preview.deviceContactId,
  };
}

export async function createMinimalPersonFromContact(picked: PickedContact): Promise<string> {
  let avatarUri = picked.avatarUri;
  if (!avatarUri && picked.deviceContactId) {
    avatarUri = await fetchContactImageUri(picked.deviceContactId);
  } else if (avatarUri) {
    avatarUri = await persistContactImageUri(avatarUri);
  }

  return peopleService.create(toMinimalCreateInput(picked, avatarUri));
}

export async function createMinimalPeopleFromContacts(
  previews: DeviceContactPreview[],
): Promise<string[]> {
  const existing = await peopleService.list(2000, 0);
  const createdIds: string[] = [];

  for (const preview of previews) {
    if (!preview.fullName || preview.isDuplicate) continue;

    const duplicate = detectDuplicates(preview.fullName, existing, {
      phone: preview.phone,
      email: preview.email,
    });
    if (duplicate.isDuplicate) continue;

    const picked = await preparePickedContact(preview);
    const uuid = await peopleService.create(toMinimalCreateInput(picked, picked.avatarUri));
    createdIds.push(uuid);
    existing.push({
      id: uuid,
      fullName: preview.fullName,
      birthDate: picked.birthDate ?? PLACEHOLDER_BIRTH_DATE,
      gender: 'other',
      relationship: 'friend',
      phone: preview.phone,
      email: preview.email,
      avatarUri: picked.avatarUri,
      reminderDaysBefore: 3,
      reminderTime: '08:00',
      repeatYearly: true,
      eventType: 'birthday',
      hobbies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Person);
  }

  return createdIds;
}

export async function listDeviceContacts(force = false): Promise<DeviceContactPreview[]> {
  const data = await fetchDeviceContacts(force);
  const existing = await peopleService.list(2000, 0);

  return data
    .map((contact) => mapContactToPreview(contact, existing))
    .filter((contact) => contact.fullName.length > 0)
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function importSelectedContacts(
  ids: string[],
  mergeDuplicates = false,
): Promise<ContactImportResult> {
  if (ids.length === 0) {
    return { imported: 0, skipped: 0, total: 0, personIds: [] };
  }

  const data = await fetchDeviceContacts();
  const idSet = new Set(ids);
  const existing = await peopleService.list(2000, 0);

  let imported = 0;
  let skipped = 0;
  const personIds: string[] = [];

  for (const contact of data) {
    const fullName = buildName(contact);
    const birthDate = formatBirthDate(contact);
    const id = contactId(contact, fullName, birthDate);

    if (!idSet.has(id)) continue;

    const phone = contact.phoneNumbers?.[0]?.number;
    const email = contact.emails?.[0]?.email;

    if (!fullName) {
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
          birthDate: birthDate ?? undefined,
        });
        personIds.push(duplicate.existingPersonId);
        imported += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    const deviceId = (contact as Contacts.Contact & { id?: string }).id;
    const avatarUri = deviceId ? await fetchContactImageUri(deviceId) : undefined;
    const resolvedBirthDate = birthDate ?? PLACEHOLDER_BIRTH_DATE;

    const uuid = await peopleService.create(
      toCreateInput(contact, fullName, resolvedBirthDate, avatarUri),
    );
    personIds.push(uuid);
    existing.push({
      id: uuid,
      fullName,
      birthDate: resolvedBirthDate,
      gender: 'other',
      relationship: 'friend',
      phone,
      email,
      avatarUri,
      reminderDaysBefore: 3,
      reminderTime: '08:00',
      repeatYearly: true,
      eventType: 'birthday',
      hobbies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Person);
    imported += 1;
  }

  return { imported, skipped, total: ids.length, personIds };
}

export async function importContactsFromDevice(): Promise<ContactImportResult> {
  const contacts = await listDeviceContacts();
  const ids = contacts.filter((c) => c.selected).map((c) => c.id);
  return importSelectedContacts(ids);
}
