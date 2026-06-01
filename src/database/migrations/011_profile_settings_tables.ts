import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration011ProfileSettingsTables: Migration = {
  version: 11,
  name: 'profile_settings_tables',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS backup_history (
        ${BASE_ENTITY_COLUMNS},
        backup_type TEXT NOT NULL DEFAULT 'json',
        file_name TEXT,
        file_size INTEGER NOT NULL DEFAULT 0,
        modules TEXT NOT NULL DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'completed',
        error_message TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_backup_history_created_at ON backup_history(created_at);

      CREATE TABLE IF NOT EXISTS export_history (
        ${BASE_ENTITY_COLUMNS},
        export_type TEXT NOT NULL DEFAULT 'json',
        module TEXT NOT NULL DEFAULT 'all',
        file_name TEXT,
        file_size INTEGER NOT NULL DEFAULT 0,
        format TEXT NOT NULL DEFAULT 'json',
        status TEXT NOT NULL DEFAULT 'completed'
      );
      CREATE INDEX IF NOT EXISTS idx_export_history_created_at ON export_history(created_at);

      CREATE TABLE IF NOT EXISTS user_profile (
        ${BASE_ENTITY_COLUMNS},
        full_name TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        gender TEXT NOT NULL DEFAULT 'other',
        birthday TEXT NOT NULL DEFAULT '',
        location TEXT NOT NULL DEFAULT '',
        bio TEXT NOT NULL DEFAULT '',
        profile_image TEXT,
        relationship_status TEXT NOT NULL DEFAULT '',
        preferences TEXT NOT NULL DEFAULT '{}',
        is_premium INTEGER NOT NULL DEFAULT 0,
        streak INTEGER NOT NULL DEFAULT 0,
        joined_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS notification_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS privacy_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS calendar_sync_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT NOT NULL UNIQUE,
        enabled INTEGER NOT NULL DEFAULT 0,
        last_sync_at TEXT,
        sync_token TEXT,
        settings_json TEXT NOT NULL DEFAULT '{}',
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS appearance_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS card_history (
        ${BASE_ENTITY_COLUMNS},
        card_uuid TEXT,
        template_id TEXT,
        person_id TEXT,
        action TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT '',
        metadata TEXT NOT NULL DEFAULT '{}'
      );
      CREATE INDEX IF NOT EXISTS idx_card_history_action ON card_history(action);
      CREATE INDEX IF NOT EXISTS idx_card_history_created_at ON card_history(created_at);
    `);
  },
};
