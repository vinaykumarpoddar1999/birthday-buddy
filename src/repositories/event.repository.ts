import type { CreatePersonInput, EventType } from '@/types/entities';

import { BaseRepository } from './base-repository';

export class EventRepository extends BaseRepository {
  async insertForPerson(
    personId: number,
    input: CreatePersonInput,
  ): Promise<void> {
    const uuid = this.newUuid();
    const now = this.now();
    const eventType = input.eventType ?? 'birthday';
    const reminderDays = JSON.stringify([input.reminderDaysBefore ?? 3]);
    const repeatYearly = input.repeatYearly !== false ? 1 : 0;

    await this.run(
      `INSERT INTO events (
        uuid, created_at, updated_at, sync_status, device_id,
        person_id, event_type, event_date, reminder_days, repeat_yearly, notes
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        personId,
        eventType,
        input.birthDate,
        reminderDays,
        repeatYearly,
        input.notes ?? null,
      ],
    );
  }

  async updateForPerson(
    personId: number,
    input: Partial<CreatePersonInput> & { birthDate?: string },
  ): Promise<void> {
    const now = this.now();
    const fields: string[] = ['updated_at = ?', 'version = version + 1', "sync_status = 'pending'"];
    const params: (string | number | null)[] = [now];

    if (input.birthDate !== undefined) {
      fields.push('event_date = ?');
      params.push(input.birthDate);
    }
    if (input.eventType !== undefined) {
      fields.push('event_type = ?');
      params.push(input.eventType);
    }
    if (input.reminderDaysBefore !== undefined) {
      fields.push('reminder_days = ?');
      params.push(JSON.stringify([input.reminderDaysBefore]));
    }
    if (input.repeatYearly !== undefined) {
      fields.push('repeat_yearly = ?');
      params.push(input.repeatYearly ? 1 : 0);
    }

    await this.run(
      `UPDATE events SET ${fields.join(', ')}
       WHERE person_id = ? AND is_deleted = 0
       AND id = (SELECT id FROM events WHERE person_id = ? AND is_deleted = 0 ORDER BY id ASC LIMIT 1)`,
      [...params, personId, personId],
    );
  }

  async getPrimaryEventId(personId: number): Promise<number | null> {
    const row = await this.getFirst<{ id: number }>(
      `SELECT id FROM events WHERE person_id = ? AND ${this.notDeletedClause()} ORDER BY id ASC LIMIT 1`,
      [personId],
    );
    return row?.id ?? null;
  }

  async getEventIdsByPersonId(personId: number): Promise<number[]> {
    const rows = await this.getAll<{ id: number }>(
      `SELECT id FROM events WHERE person_id = ? AND ${this.notDeletedClause()}`,
      [personId],
    );
    return rows.map((r) => r.id);
  }

  async softDeleteByPersonId(personId: number): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE events SET is_deleted = 1, deleted_at = ?, updated_at = ?,
        version = version + 1, sync_status = 'pending' WHERE person_id = ? AND is_deleted = 0`,
      [now, now, personId],
    );
  }

  async findByMonth(year: number, month: number): Promise<
    Array<{ personUuid: string; eventDate: string; eventType: EventType; fullName: string }>
  > {
    const monthStr = String(month).padStart(2, '0');
    const pattern = `%-${monthStr}-%`;
    return this.getAll(
      `SELECT p.uuid as personUuid, e.event_date as eventDate, e.event_type as eventType, p.full_name as fullName
       FROM events e
       JOIN people p ON p.id = e.person_id
       WHERE e.is_deleted = 0 AND p.is_deleted = 0
       AND (e.event_date LIKE ? OR e.repeat_yearly = 1)
       ORDER BY e.event_date ASC`,
      [pattern],
    );
  }
}

export const eventRepository = new EventRepository();
