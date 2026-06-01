import type { SQLiteDatabase } from 'expo-sqlite';

export type SyncStatus = 'pending' | 'synced' | 'conflict' | 'failed';

export type SqlParams = (string | number | null | boolean)[];

export interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
}

export const BASE_ENTITY_COLUMNS = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  device_id TEXT,
  last_synced_at TEXT
`;

export interface BaseEntityRow {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: number;
  version: number;
  sync_status: SyncStatus;
  device_id: string | null;
  last_synced_at: string | null;
}
