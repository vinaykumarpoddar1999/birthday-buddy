import type { Migration } from '../types';

export const migration010SearchFtsExtended: Migration = {
  version: 10,
  name: 'search_fts_extended',
  up: async (db) => {
    await db.execAsync(`
      CREATE TRIGGER IF NOT EXISTS wishes_fts_insert AFTER INSERT ON ai_wishes
      WHEN NEW.is_deleted = 0 BEGIN
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        VALUES ('wish', NEW.uuid, COALESCE(NEW.tone, 'Wish'), NEW.wish_text);
      END;

      CREATE TRIGGER IF NOT EXISTS wishes_fts_update AFTER UPDATE ON ai_wishes BEGIN
        DELETE FROM search_index WHERE entity_type = 'wish' AND entity_uuid = NEW.uuid;
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        SELECT 'wish', NEW.uuid, COALESCE(NEW.tone, 'Wish'), NEW.wish_text
        WHERE NEW.is_deleted = 0;
      END;

      CREATE TRIGGER IF NOT EXISTS wishes_fts_delete AFTER DELETE ON ai_wishes BEGIN
        DELETE FROM search_index WHERE entity_type = 'wish' AND entity_uuid = OLD.uuid;
      END;

      CREATE TRIGGER IF NOT EXISTS cards_fts_insert AFTER INSERT ON cards
      WHEN NEW.is_deleted = 0 BEGIN
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        VALUES ('card', NEW.uuid, 'Saved Card', NEW.card_json);
      END;

      CREATE TRIGGER IF NOT EXISTS cards_fts_update AFTER UPDATE ON cards BEGIN
        DELETE FROM search_index WHERE entity_type = 'card' AND entity_uuid = NEW.uuid;
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        SELECT 'card', NEW.uuid, 'Saved Card', NEW.card_json
        WHERE NEW.is_deleted = 0;
      END;

      CREATE TRIGGER IF NOT EXISTS cards_fts_delete AFTER DELETE ON cards BEGIN
        DELETE FROM search_index WHERE entity_type = 'card' AND entity_uuid = OLD.uuid;
      END;

      CREATE TRIGGER IF NOT EXISTS notifications_fts_insert AFTER INSERT ON notifications BEGIN
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        VALUES ('notification', NEW.uuid, NEW.title, NEW.message);
      END;

      CREATE TRIGGER IF NOT EXISTS notifications_fts_update AFTER UPDATE ON notifications BEGIN
        DELETE FROM search_index WHERE entity_type = 'notification' AND entity_uuid = NEW.uuid;
        INSERT INTO search_index(entity_type, entity_uuid, title, body)
        VALUES ('notification', NEW.uuid, NEW.title, NEW.message);
      END;

      CREATE TRIGGER IF NOT EXISTS notifications_fts_delete AFTER DELETE ON notifications BEGIN
        DELETE FROM search_index WHERE entity_type = 'notification' AND entity_uuid = OLD.uuid;
      END;
    `);

    await db.execAsync(`
      INSERT INTO search_index(entity_type, entity_uuid, title, body)
      SELECT 'wish', uuid, COALESCE(tone, 'Wish'), wish_text FROM ai_wishes WHERE is_deleted = 0;

      INSERT INTO search_index(entity_type, entity_uuid, title, body)
      SELECT 'card', uuid, 'Saved Card', card_json FROM cards WHERE is_deleted = 0;

      INSERT INTO search_index(entity_type, entity_uuid, title, body)
      SELECT 'notification', uuid, title, message FROM notifications;
    `);
  },
};
