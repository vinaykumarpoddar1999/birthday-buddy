import type { Migration } from '../types';

export const migration007SearchFts: Migration = {
  version: 7,
  name: 'search_fts',
  up: async (db) => {
    await db.execAsync(`
      CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
        entity_type,
        entity_uuid,
        title,
        body,
        tokenize = 'porter unicode61'
      );
    `);

    await db.execAsync(`
      CREATE TRIGGER IF NOT EXISTS people_fts_insert AFTER INSERT ON people
      WHEN NEW.is_deleted = 0 BEGIN
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        VALUES ('person', NEW.uuid, NEW.full_name, COALESCE(NEW.nickname, '') || ' ' || COALESCE(NEW.notes, ''));
      END;

      CREATE TRIGGER IF NOT EXISTS people_fts_update AFTER UPDATE ON people BEGIN
        DELETE FROM search_index WHERE entity_type = 'person' AND entity_uuid = NEW.uuid;
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        SELECT 'person', NEW.uuid, NEW.full_name, COALESCE(NEW.nickname, '') || ' ' || COALESCE(NEW.notes, '')
        WHERE NEW.is_deleted = 0;
      END;

      CREATE TRIGGER IF NOT EXISTS people_fts_delete AFTER DELETE ON people BEGIN
        DELETE FROM search_index WHERE entity_type = 'person' AND entity_uuid = OLD.uuid;
      END;
    `);
  },
};
