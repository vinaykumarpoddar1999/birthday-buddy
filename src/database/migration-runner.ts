import type { SQLiteDatabase } from 'expo-sqlite';

import { MigrationError } from './errors';
import { MIGRATION_REGISTRY } from './migration-registry';
import type { Migration } from './types';

export { MIGRATION_REGISTRY, CURRENT_SCHEMA_VERSION } from './migration-registry';

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);

  for (const migration of MIGRATION_REGISTRY) {
    await applyMigration(db, migration);
  }
}

async function applyMigration(db: SQLiteDatabase, migration: Migration): Promise<void> {
  const applied = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_migrations WHERE version = ?',
    migration.version,
  );

  if (applied) return;

  try {
    await migration.up(db);
    await db.runAsync(
      'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)',
      migration.version,
      migration.name,
      new Date().toISOString(),
    );
  } catch (error) {
    throw new MigrationError(
      `Migration ${migration.version} (${migration.name}) failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
