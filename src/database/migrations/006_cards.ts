import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration006Cards: Migration = {
  version: 6,
  name: 'cards',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS card_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        preview_uri TEXT,
        template_json TEXT NOT NULL,
        is_premium INTEGER NOT NULL DEFAULT 0,
        tags TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_card_templates_category ON card_templates(category);
      CREATE INDEX IF NOT EXISTS idx_card_templates_is_premium ON card_templates(is_premium);

      CREATE TABLE IF NOT EXISTS cards (
        ${BASE_ENTITY_COLUMNS},
        person_id INTEGER,
        template_id INTEGER,
        card_json TEXT NOT NULL,
        thumbnail_uri TEXT,
        export_uri TEXT,
        favorite INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (person_id) REFERENCES people(id),
        FOREIGN KEY (template_id) REFERENCES card_templates(id)
      );
      CREATE INDEX IF NOT EXISTS idx_cards_person_id ON cards(person_id);
      CREATE INDEX IF NOT EXISTS idx_cards_template_id ON cards(template_id);
      CREATE INDEX IF NOT EXISTS idx_cards_favorite ON cards(favorite);
    `);
  },
};
