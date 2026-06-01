import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration009SyncColumnsFeedback: Migration = {
  version: 9,
  name: 'sync_columns_feedback',
  up: async (db) => {
    const addColumn = async (sql: string) => {
      try {
        await db.execAsync(sql);
      } catch {
        /* column may already exist on dev rebuilds */
      }
    };

    for (const col of [
      'deleted_at TEXT',
      'is_deleted INTEGER NOT NULL DEFAULT 0',
      'version INTEGER NOT NULL DEFAULT 1',
      "sync_status TEXT NOT NULL DEFAULT 'pending'",
      'device_id TEXT',
      'last_synced_at TEXT',
    ]) {
      await addColumn(`ALTER TABLE notifications ADD COLUMN ${col};`);
    }

    for (const col of [
      'updated_at TEXT',
      'deleted_at TEXT',
      'is_deleted INTEGER NOT NULL DEFAULT 0',
      'version INTEGER NOT NULL DEFAULT 1',
      "sync_status TEXT NOT NULL DEFAULT 'pending'",
      'device_id TEXT',
      'last_synced_at TEXT',
    ]) {
      await addColumn(`ALTER TABLE wish_history ADD COLUMN ${col};`);
    }
    await db.runAsync(
      "UPDATE wish_history SET updated_at = created_at WHERE updated_at IS NULL",
    );

    for (const col of [
      'deleted_at TEXT',
      'is_deleted INTEGER NOT NULL DEFAULT 0',
      'version INTEGER NOT NULL DEFAULT 1',
      "sync_status TEXT NOT NULL DEFAULT 'pending'",
      'device_id TEXT',
      'last_synced_at TEXT',
    ]) {
      await addColumn(`ALTER TABLE card_templates ADD COLUMN ${col};`);
    }

    for (const col of [
      'updated_at TEXT',
      'deleted_at TEXT',
      'is_deleted INTEGER NOT NULL DEFAULT 0',
      'version INTEGER NOT NULL DEFAULT 1',
      "sync_status TEXT NOT NULL DEFAULT 'pending'",
      'device_id TEXT',
      'last_synced_at TEXT',
    ]) {
      await addColumn(`ALTER TABLE activity_logs ADD COLUMN ${col};`);
    }
    await db.runAsync(
      "UPDATE activity_logs SET updated_at = created_at WHERE updated_at IS NULL",
    );

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        ${BASE_ENTITY_COLUMNS},
        subject TEXT NOT NULL,
        category TEXT NOT NULL,
        message TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_feedbacks_category ON feedbacks(category);
      CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
      CREATE INDEX IF NOT EXISTS idx_ai_wishes_person_id ON ai_wishes(person_id);
      CREATE INDEX IF NOT EXISTS idx_ai_wishes_favorite ON ai_wishes(favorite);
      CREATE INDEX IF NOT EXISTS idx_cards_person_id ON cards(person_id);
      CREATE INDEX IF NOT EXISTS idx_cards_favorite ON cards(favorite);
      CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
      CREATE INDEX IF NOT EXISTS idx_events_person_id ON events(person_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);
      CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_time ON reminders(scheduled_time);
    `);
  },
};
