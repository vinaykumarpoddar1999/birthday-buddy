import { BaseRepository } from './base-repository';

export interface FeedbackRecord {
  id: string;
  subject: string;
  category: string;
  message: string;
  createdAt: string;
}

export class FeedbackRepository extends BaseRepository {
  async insert(subject: string, category: string, message: string): Promise<string> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO feedbacks (
        uuid, created_at, updated_at, sync_status, device_id,
        subject, category, message
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [uuid, now, now, this.deviceId, subject, category, message],
    );
    return uuid;
  }

  async findAll(limit = 50): Promise<FeedbackRecord[]> {
    const rows = await this.getAll<{
      uuid: string;
      subject: string;
      category: string;
      message: string;
      created_at: string;
    }>(
      `SELECT uuid, subject, category, message, created_at FROM feedbacks
       WHERE ${this.notDeletedClause()} ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );
    return rows.map((r) => ({
      id: r.uuid,
      subject: r.subject,
      category: r.category,
      message: r.message,
      createdAt: r.created_at,
    }));
  }

  async softDelete(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE feedbacks SET is_deleted = 1, deleted_at = ?, updated_at = ?,
        sync_status = 'pending' WHERE uuid = ? AND is_deleted = 0`,
      [now, now, uuid],
    );
  }
}

export const feedbackRepository = new FeedbackRepository();
