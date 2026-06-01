import { BaseRepository } from './base-repository';

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export class NotificationRepository extends BaseRepository {
  async findAll(limit = 50): Promise<NotificationRecord[]> {
    const rows = await this.getAll<{
      uuid: string;
      title: string;
      message: string;
      type: string;
      is_read: number;
      created_at: string;
    }>(
      `SELECT uuid, title, message, type, is_read, created_at FROM notifications
       WHERE COALESCE(is_deleted, 0) = 0 ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );
    return rows.map((r) => ({
      id: r.uuid,
      title: r.title,
      message: r.message,
      type: r.type,
      isRead: r.is_read === 1,
      createdAt: r.created_at,
    }));
  }

  async insert(title: string, message: string, type: string): Promise<string> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO notifications (uuid, title, message, type, is_read, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?)`,
      [uuid, title, message, type, now, now],
    );
    return uuid;
  }

  async markRead(uuid: string): Promise<void> {
    await this.run(
      'UPDATE notifications SET is_read = 1, updated_at = ? WHERE uuid = ?',
      [this.now(), uuid],
    );
  }

  async markAllRead(): Promise<void> {
    await this.run('UPDATE notifications SET is_read = 1, updated_at = ?', [this.now()]);
  }

  async delete(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE notifications SET is_deleted = 1, deleted_at = ?, updated_at = ?
       WHERE uuid = ?`,
      [now, now, uuid],
    );
  }

  async clearAll(): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE notifications SET is_deleted = 1, deleted_at = ?, updated_at = ?
       WHERE COALESCE(is_deleted, 0) = 0`,
      [now, now],
    );
  }

  async countUnread(): Promise<number> {
    const row = await this.getFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM notifications WHERE is_read = 0 AND COALESCE(is_deleted, 0) = 0',
    );
    return row?.count ?? 0;
  }
}

export const notificationRepository = new NotificationRepository();
