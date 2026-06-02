import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { DatabaseError } from './errors';
import { runMigrations } from './migration-runner';
import type { SqlParams } from './types';

const DB_NAME = 'birthdaybuddy.db';

class DatabaseManagerClass {
  private db: SQLiteDatabase | null = null;
  private initPromise: Promise<void> | null = null;
  private deviceId: string | null = null;

  async initialize(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInitialize();
    return this.initPromise;
  }

  private async doInitialize(): Promise<void> {
    try {
      this.db = await openDatabaseAsync(DB_NAME);
      await this.db.execAsync('PRAGMA journal_mode = WAL;');
      await this.db.execAsync('PRAGMA foreign_keys = ON;');
      await runMigrations(this.db);
      const { getOrCreateDeviceId } = await import('./secure-keys');
      this.deviceId = await getOrCreateDeviceId();
      const { runLegacyImport } = await import('./legacy-import');
      await runLegacyImport();
      const { templateRegistry } = await import('@features/card-studio/templates');
      const { cardService } = await import('@/services/card/card.service');
      await cardService.syncTemplatesFromRegistry(() => templateRegistry.getAllTemplates());
    } catch (error) {
      this.initPromise = null;
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to initialize database',
      );
    }
  }

  getDeviceId(): string {
    if (!this.deviceId) {
      throw new DatabaseError('Database not initialized');
    }
    return this.deviceId;
  }

  getDb(): SQLiteDatabase {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }
    return this.db;
  }

  isReady(): boolean {
    return this.db !== null;
  }

  async run(sql: string, params: SqlParams = []): Promise<void> {
    await this.getDb().runAsync(sql, ...(params as never[]));
  }

  async getFirst<T>(sql: string, params: SqlParams = []): Promise<T | null> {
    const row = await this.getDb().getFirstAsync<T>(sql, ...(params as never[]));
    return row ?? null;
  }

  async getAll<T>(sql: string, params: SqlParams = []): Promise<T[]> {
    const rows = await this.getDb().getAllAsync<T>(sql, ...(params as never[]));
    return rows ?? [];
  }

  async withTransaction<T>(fn: () => Promise<T>): Promise<T> {
    const db = this.getDb();
    let result!: T;
    await db.withTransactionAsync(async () => {
      result = await fn();
    });
    return result;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.initPromise = null;
    }
  }
}

export const DatabaseManager = new DatabaseManagerClass();
