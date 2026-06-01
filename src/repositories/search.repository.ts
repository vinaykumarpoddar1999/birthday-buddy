import type { SearchResult } from '@/types/entities';

import { BaseRepository } from './base-repository';

export class SearchRepository extends BaseRepository {
  async searchFts(query: string, limit = 30): Promise<SearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    try {
      const rows = await this.getAll<{
        entity_type: string;
        entity_uuid: string;
        title: string;
        body: string;
      }>(
        `SELECT entity_type, entity_uuid, title, body FROM search_index
         WHERE search_index MATCH ? LIMIT ?`,
        [`${trimmed}*`, limit],
      );
      return rows.map((r) => ({
        entityType: r.entity_type,
        entityUuid: r.entity_uuid,
        title: r.title,
        body: r.body,
      }));
    } catch {
      return this.searchFallback(trimmed, limit);
    }
  }

  private async searchFallback(query: string, limit: number): Promise<SearchResult[]> {
    const pattern = `%${query}%`;
    const rows = await this.getAll<{
      entity_type: string;
      entity_uuid: string;
      title: string;
      body: string;
    }>(
      `SELECT 'person' as entity_type, uuid as entity_uuid, full_name as title,
        COALESCE(nickname, '') || ' ' || COALESCE(notes, '') as body
       FROM people WHERE is_deleted = 0 AND (full_name LIKE ? OR nickname LIKE ?)
       LIMIT ?`,
      [pattern, pattern, limit],
    );
    return rows.map((r) => ({
      entityType: r.entity_type,
      entityUuid: r.entity_uuid,
      title: r.title,
      body: r.body,
    }));
  }
}

export const searchRepository = new SearchRepository();
