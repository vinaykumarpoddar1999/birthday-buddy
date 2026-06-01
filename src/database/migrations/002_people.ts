import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration002People: Migration = {
  version: 2,
  name: 'people',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS people (
        ${BASE_ENTITY_COLUMNS},
        full_name TEXT NOT NULL,
        nickname TEXT,
        gender TEXT,
        birth_date TEXT NOT NULL,
        relationship TEXT,
        phone TEXT,
        email TEXT,
        favorite_color TEXT,
        favorite_cake TEXT,
        hobbies TEXT NOT NULL DEFAULT '[]',
        notes TEXT,
        avatar_uri TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_people_birth_date ON people(birth_date);
      CREATE INDEX IF NOT EXISTS idx_people_relationship ON people(relationship);
      CREATE INDEX IF NOT EXISTS idx_people_full_name ON people(full_name);
      CREATE INDEX IF NOT EXISTS idx_people_is_deleted ON people(is_deleted);
    `);
  },
};
