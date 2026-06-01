import { BaseRepository } from './base-repository';

export class ActivityLogRepository extends BaseRepository {
  async log(
    action: string,
    entityType?: string,
    entityUuid?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const uuid = this.newUuid();
    await this.run(
      `INSERT INTO activity_logs (uuid, action, entity_type, entity_uuid, metadata, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        action,
        entityType ?? null,
        entityUuid ?? null,
        metadata ? JSON.stringify(metadata) : null,
        this.now(),
        this.now(),
      ],
    );
  }

  async findRecent(limit = 50): Promise<
    Array<{
      uuid: string;
      action: string;
      entityType: string | null;
      entityUuid: string | null;
      metadata: string | null;
      createdAt: string;
    }>
  > {
    const rows = await this.getAll<{
      uuid: string;
      action: string;
      entity_type: string | null;
      entity_uuid: string | null;
      metadata: string | null;
      created_at: string;
    }>(
      `SELECT uuid, action, entity_type, entity_uuid, metadata, created_at FROM activity_logs
       WHERE COALESCE(is_deleted, 0) = 0 ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );

    return rows.map((r) => ({
      uuid: r.uuid,
      action: r.action,
      entityType: r.entity_type,
      entityUuid: r.entity_uuid,
      metadata: r.metadata,
      createdAt: r.created_at,
    }));
  }
}

export const activityLogRepository = new ActivityLogRepository();
