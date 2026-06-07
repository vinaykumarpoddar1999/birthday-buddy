import { BaseRepository } from './base-repository';

export class ReminderRepository extends BaseRepository {
  async insert(eventId: number, scheduledTime: string, notificationId?: string): Promise<string> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO reminders (
        uuid, created_at, updated_at, sync_status, device_id,
        event_id, scheduled_time, status, notification_id
      ) VALUES (?, ?, ?, 'pending', ?, ?, ?, 'pending', ?)`,
      [uuid, now, now, this.deviceId, eventId, scheduledTime, notificationId ?? null],
    );
    return uuid;
  }

  async getNotificationIdsByEventIds(eventIds: number[]): Promise<string[]> {
    if (eventIds.length === 0) return [];
    const placeholders = eventIds.map(() => '?').join(',');
    const rows = await this.getAll<{ notification_id: string | null }>(
      `SELECT notification_id FROM reminders
       WHERE event_id IN (${placeholders}) AND ${this.notDeletedClause()}
       AND notification_id IS NOT NULL`,
      eventIds,
    );
    return rows.map((r) => r.notification_id).filter((id): id is string => Boolean(id));
  }

  async getAllActiveNotificationIds(): Promise<string[]> {
    const rows = await this.getAll<{ notification_id: string | null }>(
      `SELECT notification_id FROM reminders
       WHERE ${this.notDeletedClause()} AND notification_id IS NOT NULL`,
    );
    return rows.map((r) => r.notification_id).filter((id): id is string => Boolean(id));
  }

  async softDeleteByEventIds(eventIds: number[]): Promise<void> {
    if (eventIds.length === 0) return;
    const now = this.now();
    const placeholders = eventIds.map(() => '?').join(',');
    await this.run(
      `UPDATE reminders SET is_deleted = 1, deleted_at = ?, updated_at = ?,
        sync_status = 'pending' WHERE event_id IN (${placeholders}) AND is_deleted = 0`,
      [now, now, ...eventIds],
    );
  }

  async findPending(limit = 50): Promise<
    { uuid: string; eventId: number; scheduledTime: string; notificationId: string | null }[]
  > {
    const rows = await this.getAll<{
      uuid: string;
      event_id: number;
      scheduled_time: string;
      notification_id: string | null;
    }>(
      `SELECT uuid, event_id, scheduled_time, notification_id FROM reminders
       WHERE ${this.notDeletedClause()} AND status = 'pending'
       ORDER BY scheduled_time ASC LIMIT ?`,
      [limit],
    );
    return rows.map((r) => ({
      uuid: r.uuid,
      eventId: r.event_id,
      scheduledTime: r.scheduled_time,
      notificationId: r.notification_id,
    }));
  }

  async markTriggered(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE reminders SET status = 'triggered', triggered_at = ?, updated_at = ?,
        sync_status = 'pending' WHERE uuid = ? AND is_deleted = 0`,
      [now, now, uuid],
    );
  }
}

export const reminderRepository = new ReminderRepository();
