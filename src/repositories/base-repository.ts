import { DatabaseManager } from '@/database/database-manager';
import type { SqlParams } from '@/database/types';
import { generateUuidSync } from '@/utils/uuid';
import { nowIso } from '@/utils/datetime';

import { RepositoryError } from './repository-error';

export abstract class BaseRepository {
  protected get deviceId(): string {
    return DatabaseManager.getDeviceId();
  }

  protected async run(sql: string, params: SqlParams = []): Promise<void> {
    try {
      await DatabaseManager.run(sql, params);
    } catch (error) {
      throw new RepositoryError(error instanceof Error ? error.message : 'Database operation failed');
    }
  }

  protected async getFirst<T>(sql: string, params: SqlParams = []): Promise<T | null> {
    try {
      return await DatabaseManager.getFirst<T>(sql, params);
    } catch (error) {
      throw new RepositoryError(error instanceof Error ? error.message : 'Database query failed');
    }
  }

  protected async getAll<T>(sql: string, params: SqlParams = []): Promise<T[]> {
    try {
      return await DatabaseManager.getAll<T>(sql, params);
    } catch (error) {
      throw new RepositoryError(error instanceof Error ? error.message : 'Database query failed');
    }
  }

  protected newUuid(): string {
    return generateUuidSync();
  }

  protected now(): string {
    return nowIso();
  }

  protected notDeletedClause(alias = ''): string {
    const prefix = alias ? `${alias}.` : '';
    return `${prefix}is_deleted = 0`;
  }
}
