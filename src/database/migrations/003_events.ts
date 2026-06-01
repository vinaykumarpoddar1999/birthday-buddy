import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration003Events: Migration = {
  version: 3,
  name: 'events',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS events (
        ${BASE_ENTITY_COLUMNS},
        person_id INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        event_date TEXT NOT NULL,
        reminder_days TEXT NOT NULL DEFAULT '[3]',
        repeat_yearly INTEGER NOT NULL DEFAULT 1,
        notes TEXT,
        FOREIGN KEY (person_id) REFERENCES people(id)
      );
      CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
      CREATE INDEX IF NOT EXISTS idx_events_person_id ON events(person_id);
      CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
      CREATE INDEX IF NOT EXISTS idx_events_is_deleted ON events(is_deleted);
    `);
  },
};
