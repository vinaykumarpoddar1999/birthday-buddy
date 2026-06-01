import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration005AiWishes: Migration = {
  version: 5,
  name: 'ai_wishes',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ai_wishes (
        ${BASE_ENTITY_COLUMNS},
        person_id INTEGER NOT NULL,
        tone TEXT,
        language TEXT,
        wish_text TEXT NOT NULL,
        generated_source TEXT NOT NULL DEFAULT 'local',
        favorite INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (person_id) REFERENCES people(id)
      );
      CREATE INDEX IF NOT EXISTS idx_ai_wishes_person_id ON ai_wishes(person_id);
      CREATE INDEX IF NOT EXISTS idx_ai_wishes_tone ON ai_wishes(tone);
      CREATE INDEX IF NOT EXISTS idx_ai_wishes_favorite ON ai_wishes(favorite);

      CREATE TABLE IF NOT EXISTS wish_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        person_id INTEGER NOT NULL,
        wish_id INTEGER,
        action TEXT NOT NULL,
        shared_to TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (person_id) REFERENCES people(id),
        FOREIGN KEY (wish_id) REFERENCES ai_wishes(id)
      );
      CREATE INDEX IF NOT EXISTS idx_wish_history_person_id ON wish_history(person_id);
    `);
  },
};
