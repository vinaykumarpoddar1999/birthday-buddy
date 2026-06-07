import type { EventType, Person } from '@/types/entities';

export function getEventLabel(
  eventType: EventType,
  customEventName?: string,
): string {
  if (eventType === 'custom' && customEventName?.trim()) {
    return customEventName.trim();
  }
  if (eventType === 'birthday') return 'Birthday';
  if (eventType === 'anniversary') return 'Anniversary';
  if (eventType === 'wedding_anniversary') return 'Wedding Anniversary';
  return 'Custom Event';
}

export function getPersonEventLabel(person: Pick<Person, 'eventType' | 'customEventName'>): string {
  return getEventLabel(person.eventType, person.customEventName);
}
