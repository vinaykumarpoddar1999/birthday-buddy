import type { CardTemplate as StudioCardTemplate } from '@features/card-studio/types';

import type { CardRecord, CardTemplate } from '@/types/entities';

import { BaseRepository } from './base-repository';

export class CardRepository extends BaseRepository {
  async upsertStudioTemplate(template: StudioCardTemplate): Promise<void> {
    const now = this.now();
    const existing = await this.getFirst<{ id: number }>(
      'SELECT id FROM card_templates WHERE uuid = ?',
      [template.id],
    );
    const templateJson = JSON.stringify(template);
    const tags = JSON.stringify(template.tags);

    if (existing) {
      await this.run(
        `UPDATE card_templates SET name = ?, category = ?, template_json = ?, is_premium = ?, tags = ?, updated_at = ?
         WHERE uuid = ?`,
        [
          template.name,
          template.category,
          templateJson,
          template.isPremium ? 1 : 0,
          tags,
          now,
          template.id,
        ],
      );
      return;
    }

    await this.run(
      `INSERT INTO card_templates (uuid, name, category, preview_uri, template_json, is_premium, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        template.id,
        template.name,
        template.category,
        null,
        templateJson,
        template.isPremium ? 1 : 0,
        tags,
        now,
        now,
      ],
    );
  }

  async findStudioTemplates(limit = 100): Promise<StudioCardTemplate[]> {
    const rows = await this.getAll<{ template_json: string }>(
      'SELECT template_json FROM card_templates ORDER BY name ASC LIMIT ?',
      [limit],
    );

    const templates: StudioCardTemplate[] = [];
    for (const row of rows) {
      try {
        const parsed = JSON.parse(row.template_json) as StudioCardTemplate;
        if (parsed?.id && parsed?.elements) {
          templates.push(parsed);
        }
      } catch {
        /* skip invalid rows */
      }
    }
    return templates;
  }
  async findTemplates(limit = 50): Promise<CardTemplate[]> {
    const rows = await this.getAll<{
      uuid: string;
      name: string;
      category: string;
      preview_uri: string | null;
      template_json: string;
      is_premium: number;
      tags: string;
    }>(
      'SELECT uuid, name, category, preview_uri, template_json, is_premium, tags FROM card_templates ORDER BY name ASC LIMIT ?',
      [limit],
    );

    return rows.map((r) => ({
      id: r.uuid,
      name: r.name,
      category: r.category,
      previewUri: r.preview_uri ?? undefined,
      templateJson: r.template_json,
      isPremium: r.is_premium === 1,
      tags: JSON.parse(r.tags || '[]') as string[],
    }));
  }

  async findTemplateByUuid(uuid: string): Promise<CardTemplate | null> {
    const r = await this.getFirst<{
      uuid: string;
      name: string;
      category: string;
      preview_uri: string | null;
      template_json: string;
      is_premium: number;
      tags: string;
    }>(
      'SELECT uuid, name, category, preview_uri, template_json, is_premium, tags FROM card_templates WHERE uuid = ?',
      [uuid],
    );
    if (!r) return null;
    return {
      id: r.uuid,
      name: r.name,
      category: r.category,
      previewUri: r.preview_uri ?? undefined,
      templateJson: r.template_json,
      isPremium: r.is_premium === 1,
      tags: JSON.parse(r.tags || '[]') as string[],
    };
  }

  async getTemplateInternalId(uuid: string): Promise<number | null> {
    const row = await this.getFirst<{ id: number }>(
      'SELECT id FROM card_templates WHERE uuid = ?',
      [uuid],
    );
    return row?.id ?? null;
  }

  async insert(
    personId: number | null,
    templateId: number | null,
    cardJson: string,
    thumbnailUri?: string,
    exportUri?: string,
  ): Promise<string> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO cards (
        uuid, created_at, updated_at, sync_status, device_id,
        person_id, template_id, card_json, thumbnail_uri, export_uri, favorite
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, 0)`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        personId,
        templateId,
        cardJson,
        thumbnailUri ?? null,
        exportUri ?? null,
      ],
    );
    return uuid;
  }

  async countSaved(): Promise<number> {
    const row = await this.getFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM cards WHERE ${this.notDeletedClause()}`,
    );
    return row?.count ?? 0;
  }

  async findAll(limit = 50): Promise<CardRecord[]> {
    const rows = await this.getAll<{
      uuid: string;
      card_json: string;
      thumbnail_uri: string | null;
      export_uri: string | null;
      favorite: number;
      created_at: string;
      person_uuid: string | null;
    }>(
      `SELECT c.uuid, c.card_json, c.thumbnail_uri, c.export_uri, c.favorite, c.created_at, p.uuid as person_uuid
       FROM cards c
       LEFT JOIN people p ON p.id = c.person_id
       WHERE c.is_deleted = 0
       ORDER BY c.created_at DESC LIMIT ?`,
      [limit],
    );
    return rows.map((r) => ({
      id: r.uuid,
      personId: r.person_uuid ?? undefined,
      cardJson: r.card_json,
      thumbnailUri: r.thumbnail_uri ?? undefined,
      exportUri: r.export_uri ?? undefined,
      favorite: r.favorite === 1,
      createdAt: r.created_at,
    }));
  }

  async toggleFavorite(uuid: string, favorite: boolean): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE cards SET favorite = ?, updated_at = ?, sync_status = 'pending'
       WHERE uuid = ? AND is_deleted = 0`,
      [favorite ? 1 : 0, now, uuid],
    );
  }

  async softDelete(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE cards SET is_deleted = 1, deleted_at = ?, updated_at = ?,
        sync_status = 'pending' WHERE uuid = ? AND is_deleted = 0`,
      [now, now, uuid],
    );
  }

  async findByPersonUuid(personUuid: string, limit = 20): Promise<CardRecord[]> {
    const rows = await this.getAll<{
      uuid: string;
      card_json: string;
      thumbnail_uri: string | null;
      export_uri: string | null;
      favorite: number;
      created_at: string;
      person_uuid: string | null;
    }>(
      `SELECT c.uuid, c.card_json, c.thumbnail_uri, c.export_uri, c.favorite, c.created_at, p.uuid as person_uuid
       FROM cards c
       LEFT JOIN people p ON p.id = c.person_id
       WHERE p.uuid = ? AND c.is_deleted = 0
       ORDER BY c.created_at DESC LIMIT ?`,
      [personUuid, limit],
    );

    return rows.map((r) => ({
      id: r.uuid,
      personId: r.person_uuid ?? undefined,
      cardJson: r.card_json,
      thumbnailUri: r.thumbnail_uri ?? undefined,
      exportUri: r.export_uri ?? undefined,
      favorite: r.favorite === 1,
      createdAt: r.created_at,
    }));
  }
}

export const cardRepository = new CardRepository();
