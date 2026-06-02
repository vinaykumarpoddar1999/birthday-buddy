import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration013SurpriseExperiences: Migration = {
  version: 13,
  name: 'surprise_experiences',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS surprise_experiences (
        ${BASE_ENTITY_COLUMNS},
        person_id INTEGER,
        slug TEXT NOT NULL UNIQUE,
        share_link TEXT NOT NULL,
        short_url TEXT,
        occasion TEXT NOT NULL,
        recipient_type TEXT NOT NULL,
        template_id TEXT NOT NULL,
        experience_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        published_at TEXT,
        thumbnail_uri TEXT,
        FOREIGN KEY (person_id) REFERENCES people(id)
      );
      CREATE INDEX IF NOT EXISTS idx_surprise_experiences_slug ON surprise_experiences(slug);
      CREATE INDEX IF NOT EXISTS idx_surprise_experiences_person_id ON surprise_experiences(person_id);
      CREATE INDEX IF NOT EXISTS idx_surprise_experiences_status ON surprise_experiences(status);

      CREATE TABLE IF NOT EXISTS surprise_analytics (
        ${BASE_ENTITY_COLUMNS},
        experience_uuid TEXT NOT NULL,
        viewed INTEGER NOT NULL DEFAULT 0,
        open_count INTEGER NOT NULL DEFAULT 0,
        completion_rate REAL NOT NULL DEFAULT 0,
        section_views_json TEXT NOT NULL DEFAULT '{}',
        last_viewed_at TEXT,
        FOREIGN KEY (experience_uuid) REFERENCES surprise_experiences(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_surprise_analytics_experience ON surprise_analytics(experience_uuid);

      CREATE TABLE IF NOT EXISTS surprise_reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        experience_uuid TEXT NOT NULL,
        reaction_type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (experience_uuid) REFERENCES surprise_experiences(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_surprise_reactions_experience ON surprise_reactions(experience_uuid);

      CREATE TABLE IF NOT EXISTS surprise_replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL UNIQUE,
        experience_uuid TEXT NOT NULL,
        reply_type TEXT NOT NULL,
        content TEXT NOT NULL,
        media_uri TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (experience_uuid) REFERENCES surprise_experiences(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_surprise_replies_experience ON surprise_replies(experience_uuid);
    `);
  },
};
