import { DatabaseManager } from '@/database/database-manager';
import { peopleRepository } from '@/repositories/people.repository';
import { eventRepository } from '@/repositories/event.repository';
import { activityLogRepository } from '@/repositories/activity-log.repository';
import { refreshActivityFeed } from '@/services/activity/activity-sync.service';
import { reminderService } from '@/services/reminder/reminder.service';
import type { CreatePersonInput, Person, UpdatePersonInput } from '@/types/entities';

export class PeopleService {
  async list(limit = 50, offset = 0): Promise<Person[]> {
    return peopleRepository.findAll(limit, offset);
  }

  async getById(uuid: string): Promise<Person | null> {
    return peopleRepository.findByUuid(uuid);
  }

  async create(input: CreatePersonInput): Promise<string> {
    const uuid = await DatabaseManager.withTransaction(async () => {
      const newUuid = await peopleRepository.insert(input);
      const personId = await peopleRepository.getInternalId(newUuid);
      if (!personId) throw new Error('Failed to create person');
      await eventRepository.insertForPerson(personId, input);
      await activityLogRepository.log('created_person', 'person', newUuid);
      return newUuid;
    });

    const person = await peopleRepository.findByUuid(uuid);
    if (person) {
      await reminderService.scheduleForPerson(person);
    }
    await refreshActivityFeed();
    return uuid;
  }

  async update(input: UpdatePersonInput): Promise<void> {
    await DatabaseManager.withTransaction(async () => {
      await peopleRepository.update(input);
      const personId = await peopleRepository.getInternalId(input.id);
      if (personId) {
        await eventRepository.updateForPerson(personId, input);
      }
      await activityLogRepository.log('updated_person', 'person', input.id);
    });

    const person = await peopleRepository.findByUuid(input.id);
    if (person) {
      await reminderService.scheduleForPerson(person);
    }
    await refreshActivityFeed();
  }

  async delete(uuid: string): Promise<void> {
    await reminderService.cancelForPersonUuid(uuid);

    await DatabaseManager.withTransaction(async () => {
      const personId = await peopleRepository.getInternalId(uuid);
      if (personId) {
        await eventRepository.softDeleteByPersonId(personId);
      }
      await peopleRepository.softDelete(uuid);
      await activityLogRepository.log('deleted_person', 'person', uuid);
    });
    await refreshActivityFeed();
  }

  async count(): Promise<number> {
    return peopleRepository.count();
  }
}

export const peopleService = new PeopleService();
