import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration004Reminders: Migration = {
  version: 4,
  name: 'reminders',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reminders (
        ${BASE_ENTITY_COLUMNS},
        event_id INTEGER NOT NULL,
        scheduled_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notification_id TEXT,
        triggered_at TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id)
      );
      CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_time ON reminders(scheduled_time);
      CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);
    `);
  },
};
