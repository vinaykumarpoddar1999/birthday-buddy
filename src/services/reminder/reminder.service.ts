import { peopleRepository } from '@/repositories/people.repository';
import { eventRepository } from '@/repositories/event.repository';
import { reminderRepository } from '@/repositories/reminder.repository';
import {
  cancelScheduledNotifications,
  registerForNotifications,
  scheduleBirthdayReminders,
} from '@/services/notifications/local-notifications.service';
import type { Person } from '@/types/entities';

export class ReminderService {
  async scheduleForPerson(person: Person): Promise<void> {
    const granted = await registerForNotifications();
    if (!granted) return;

    const personId = await peopleRepository.getInternalId(person.id);
    if (!personId) return;

    const eventId = await eventRepository.getPrimaryEventId(personId);
    if (!eventId) return;

    await this.cancelForEventIds([eventId]);

    if (!person.repeatYearly) return;

    const notificationIds = await scheduleBirthdayReminders({
      contactId: person.id,
      contactName: person.fullName,
      birthDate: person.birthDate,
      reminderDaysBefore: [person.reminderDaysBefore],
      notifyTime: person.reminderTime,
      repeatYearly: person.repeatYearly,
    });

    if (notificationIds.length === 0) return;

    const scheduledTime = new Date().toISOString();
    for (const notificationId of notificationIds) {
      await reminderRepository.insert(eventId, scheduledTime, notificationId);
    }
  }

  async cancelForPersonUuid(personUuid: string): Promise<void> {
    const personId = await peopleRepository.getInternalId(personUuid);
    if (!personId) return;
    const eventIds = await eventRepository.getEventIdsByPersonId(personId);
    await this.cancelForEventIds(eventIds);
  }

  async rescheduleAll(): Promise<void> {
    const granted = await registerForNotifications();
    if (!granted) return;

    const people = await peopleRepository.findAll(500, 0);
    for (const person of people) {
      await this.cancelForPersonUuid(person.id);
      await this.scheduleForPerson(person);
    }
  }

  private async cancelForEventIds(eventIds: number[]): Promise<void> {
    if (eventIds.length === 0) return;
    const notificationIds = await reminderRepository.getNotificationIdsByEventIds(eventIds);
    await cancelScheduledNotifications(notificationIds);
    await reminderRepository.softDeleteByEventIds(eventIds);
  }
}

export const reminderService = new ReminderService();
