import { z } from 'zod';

import type { CreatePersonInput, Gender, Person, RelationshipType, UpdatePersonInput } from '@/types/entities';
import { eventTypeSchema, genderSchema, relationshipSchema } from '@/types/entities';

import { BaseRepository } from './base-repository';

interface PersonRow {
  uuid: string;
  full_name: string;
  nickname: string | null;
  gender: string | null;
  birth_date: string;
  relationship: string | null;
  phone: string | null;
  email: string | null;
  favorite_color: string | null;
  favorite_cake: string | null;
  hobbies: string;
  notes: string | null;
  avatar_uri: string | null;
  created_at: string;
  updated_at: string;
  event_type: string | null;
  reminder_days: string | null;
  repeat_yearly: number | null;
}

const createPersonSchema = z.object({
  fullName: z.string().min(1),
  birthDate: z.string().min(1),
  gender: genderSchema,
  relationship: relationshipSchema,
});

export class PeopleRepository extends BaseRepository {
  private mapRow(row: PersonRow): Person {
    let reminderDays = [3];
    try {
      const parsed = JSON.parse(row.reminder_days ?? '[3]') as number[];
      if (parsed.length > 0) reminderDays = parsed;
    } catch {
      /* use default */
    }

    const eventTypeParsed = eventTypeSchema.safeParse(row.event_type ?? 'birthday');

    return {
      id: row.uuid,
      fullName: row.full_name,
      nickname: row.nickname ?? undefined,
      gender: (row.gender as Gender) ?? 'other',
      birthDate: row.birth_date,
      relationship: (row.relationship as RelationshipType) ?? 'friend',
      phone: row.phone ?? undefined,
      email: row.email ?? undefined,
      favoriteColor: row.favorite_color ?? undefined,
      favoriteCake: row.favorite_cake ?? undefined,
      hobbies: JSON.parse(row.hobbies || '[]') as string[],
      notes: row.notes ?? undefined,
      avatarUri: row.avatar_uri ?? undefined,
      reminderDaysBefore: reminderDays[0] ?? 3,
      reminderTime: '08:00',
      repeatYearly: (row.repeat_yearly ?? 1) === 1,
      eventType: eventTypeParsed.success ? eventTypeParsed.data : 'birthday',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private selectSql(whereExtra = ''): string {
    return `
      SELECT p.uuid, p.full_name, p.nickname, p.gender, p.birth_date, p.relationship,
        p.phone, p.email, p.favorite_color, p.favorite_cake, p.hobbies, p.notes, p.avatar_uri,
        p.created_at, p.updated_at,
        e.event_type, e.reminder_days, e.repeat_yearly
      FROM people p
      LEFT JOIN events e ON e.person_id = p.id AND e.is_deleted = 0
        AND e.id = (
          SELECT id FROM events WHERE person_id = p.id AND is_deleted = 0 ORDER BY id ASC LIMIT 1
        )
      WHERE p.is_deleted = 0 ${whereExtra}
    `;
  }

  async count(): Promise<number> {
    const row = await this.getFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM people WHERE ${this.notDeletedClause()}`,
    );
    return row?.count ?? 0;
  }

  async findAll(limit = 50, offset = 0): Promise<Person[]> {
    const rows = await this.getAll<PersonRow>(
      `${this.selectSql()} ORDER BY p.full_name ASC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows.map((r) => this.mapRow(r));
  }

  async findByUuid(uuid: string): Promise<Person | null> {
    const row = await this.getFirst<PersonRow>(
      `${this.selectSql('AND p.uuid = ?')}`,
      [uuid],
    );
    return row ? this.mapRow(row) : null;
  }

  async findByUuidInternal(uuid: string): Promise<{ id: number; uuid: string } | null> {
    return this.getFirst<{ id: number; uuid: string }>(
      `SELECT id, uuid FROM people WHERE uuid = ? AND ${this.notDeletedClause()}`,
      [uuid],
    );
  }

  async insert(input: CreatePersonInput, existingUuid?: string): Promise<string> {
    const parsed = createPersonSchema.parse(input);
    const uuid = existingUuid ?? this.newUuid();
    const now = this.now();
    const hobbies = JSON.stringify(input.hobbies ?? []);

    await this.run(
      `INSERT INTO people (
        uuid, created_at, updated_at, sync_status, device_id,
        full_name, nickname, gender, birth_date, relationship,
        phone, email, favorite_color, favorite_cake, hobbies, notes, avatar_uri
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        parsed.fullName,
        input.nickname ?? null,
        parsed.gender,
        parsed.birthDate,
        parsed.relationship,
        input.phone ?? null,
        input.email ?? null,
        input.favoriteColor ?? null,
        input.favoriteCake ?? null,
        hobbies,
        input.notes ?? null,
        input.avatarUri ?? null,
      ],
    );

    return uuid;
  }

  async getInternalId(uuid: string): Promise<number | null> {
    const row = await this.getFirst<{ id: number }>(
      `SELECT id FROM people WHERE uuid = ? AND ${this.notDeletedClause()}`,
      [uuid],
    );
    return row?.id ?? null;
  }

  async update(input: UpdatePersonInput): Promise<void> {
    const existing = await this.findByUuid(input.id);
    if (!existing) return;

    const now = this.now();
    const hobbies =
      input.hobbies !== undefined ? JSON.stringify(input.hobbies) : undefined;

    const fields: string[] = ['updated_at = ?', 'version = version + 1', "sync_status = 'pending'"];
    const params: (string | number | null)[] = [now];

    const setField = (col: string, val: string | null | undefined) => {
      if (val !== undefined) {
        fields.push(`${col} = ?`);
        params.push(val);
      }
    };

    setField('full_name', input.fullName);
    setField('nickname', input.nickname ?? null);
    setField('gender', input.gender);
    setField('birth_date', input.birthDate);
    setField('relationship', input.relationship);
    setField('phone', input.phone ?? null);
    setField('email', input.email ?? null);
    setField('favorite_color', input.favoriteColor ?? null);
    setField('favorite_cake', input.favoriteCake ?? null);
    if (hobbies !== undefined) {
      fields.push('hobbies = ?');
      params.push(hobbies);
    }
    setField('notes', input.notes ?? null);
    setField('avatar_uri', input.avatarUri ?? null);

    params.push(input.id);

    await this.run(
      `UPDATE people SET ${fields.join(', ')} WHERE uuid = ? AND ${this.notDeletedClause()}`,
      params,
    );
  }

  async softDelete(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE people SET is_deleted = 1, deleted_at = ?, updated_at = ?,
        version = version + 1, sync_status = 'pending' WHERE uuid = ?`,
      [now, now, uuid],
    );
  }
}

export const peopleRepository = new PeopleRepository();
