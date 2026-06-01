import type { AiWish } from '@/types/entities';

import { BaseRepository } from './base-repository';

export class WishRepository extends BaseRepository {
  async insert(
    personId: number,
    wishText: string,
    tone?: string,
    language?: string,
    generatedSource = 'local',
  ): Promise<string> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO ai_wishes (
        uuid, created_at, updated_at, sync_status, device_id,
        person_id, tone, language, wish_text, generated_source, favorite
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, 0)`,
      [uuid, now, now, this.deviceId, personId, tone ?? null, language ?? null, wishText, generatedSource],
    );
    return uuid;
  }

  async insertHistory(
    personId: number,
    wishId: number | null,
    action: string,
    sharedTo?: string,
  ): Promise<void> {
    await this.run(
      `INSERT INTO wish_history (uuid, person_id, wish_id, action, shared_to, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [this.newUuid(), personId, wishId, action, sharedTo ?? null, this.now()],
    );
  }

  async getWishInternalId(uuid: string): Promise<number | null> {
    const row = await this.getFirst<{ id: number }>(
      'SELECT id FROM ai_wishes WHERE uuid = ? AND is_deleted = 0',
      [uuid],
    );
    return row?.id ?? null;
  }

  async getPersonIdForWish(uuid: string): Promise<number | null> {
    const row = await this.getFirst<{ person_id: number }>(
      'SELECT person_id FROM ai_wishes WHERE uuid = ? AND is_deleted = 0',
      [uuid],
    );
    return row?.person_id ?? null;
  }

  async updateWishText(uuid: string, wishText: string): Promise<void> {
    await this.run(
      `UPDATE ai_wishes SET wish_text = ?, updated_at = ?, sync_status = 'pending' WHERE uuid = ? AND is_deleted = 0`,
      [wishText, this.now(), uuid],
    );
  }

  async findByPersonUuid(personUuid: string, limit = 20): Promise<AiWish[]> {
    const rows = await this.getAll<{
      uuid: string;
      wish_text: string;
      tone: string | null;
      language: string | null;
      generated_source: string;
      favorite: number;
      created_at: string;
      person_uuid: string;
    }>(
      `SELECT w.uuid, w.wish_text, w.tone, w.language, w.generated_source, w.favorite, w.created_at, p.uuid as person_uuid
       FROM ai_wishes w
       JOIN people p ON p.id = w.person_id
       WHERE p.uuid = ? AND w.is_deleted = 0
       ORDER BY w.created_at DESC LIMIT ?`,
      [personUuid, limit],
    );

    return rows.map((r) => ({
      id: r.uuid,
      personId: r.person_uuid,
      wishText: r.wish_text,
      tone: r.tone ?? undefined,
      language: r.language ?? undefined,
      generatedSource: r.generated_source,
      favorite: r.favorite === 1,
      createdAt: r.created_at,
    }));
  }

  async findHistory(personUuid?: string, limit = 50): Promise<
    Array<{ uuid: string; action: string; sharedTo: string | null; createdAt: string; wishText?: string }>
  > {
    const sql = personUuid
      ? `SELECT h.uuid, h.action, h.shared_to, h.created_at, w.wish_text
         FROM wish_history h
         JOIN people p ON p.id = h.person_id
         LEFT JOIN ai_wishes w ON w.id = h.wish_id
         WHERE p.uuid = ?
         ORDER BY h.created_at DESC LIMIT ?`
      : `SELECT h.uuid, h.action, h.shared_to, h.created_at, w.wish_text
         FROM wish_history h
         LEFT JOIN ai_wishes w ON w.id = h.wish_id
         ORDER BY h.created_at DESC LIMIT ?`;

    const params = personUuid ? [personUuid, limit] : [limit];
    const rows = await this.getAll<{
      uuid: string;
      action: string;
      shared_to: string | null;
      created_at: string;
      wish_text: string | null;
    }>(sql, params);

    return rows.map((r) => ({
      uuid: r.uuid,
      action: r.action,
      sharedTo: r.shared_to,
      createdAt: r.created_at,
      wishText: r.wish_text ?? undefined,
    }));
  }

  async findAllRecent(limit = 100): Promise<
    Array<{
      uuid: string;
      wishText: string;
      tone: string | null;
      language: string | null;
      favorite: number;
      createdAt: string;
      personUuid: string;
      personName: string;
    }>
  > {
    const rows = await this.getAll<{
      uuid: string;
      wish_text: string;
      tone: string | null;
      language: string | null;
      favorite: number;
      created_at: string;
      person_uuid: string;
      full_name: string;
    }>(
      `SELECT w.uuid, w.wish_text, w.tone, w.language, w.favorite, w.created_at,
              p.uuid as person_uuid, p.full_name
       FROM ai_wishes w
       JOIN people p ON p.id = w.person_id
       WHERE w.is_deleted = 0 AND ${this.notDeletedClause('p')}
       ORDER BY w.created_at DESC LIMIT ?`,
      [limit],
    );

    return rows.map((r) => ({
      uuid: r.uuid,
      wishText: r.wish_text,
      tone: r.tone,
      language: r.language,
      favorite: r.favorite,
      createdAt: r.created_at,
      personUuid: r.person_uuid,
      personName: r.full_name,
    }));
  }

  async setFavorite(uuid: string, favorite: boolean): Promise<void> {
    await this.run(
      'UPDATE ai_wishes SET favorite = ?, updated_at = ?, sync_status = ? WHERE uuid = ?',
      [favorite ? 1 : 0, this.now(), 'pending', uuid],
    );
  }

  async softDelete(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE ai_wishes SET is_deleted = 1, deleted_at = ?, updated_at = ?, sync_status = ? WHERE uuid = ?`,
      [now, now, 'pending', uuid],
    );
  }
}

export const wishRepository = new WishRepository();
