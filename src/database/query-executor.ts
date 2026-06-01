import { DatabaseManager } from './database-manager';
import type { SqlParams } from './types';

/** Parameterized query execution — all SQL must go through this or repositories. */
export const QueryExecutor = {
  run(sql: string, params: SqlParams = []): Promise<void> {
    return DatabaseManager.run(sql, params);
  },

  getFirst<T>(sql: string, params: SqlParams = []): Promise<T | null> {
    return DatabaseManager.getFirst<T>(sql, params);
  },

  getAll<T>(sql: string, params: SqlParams = []): Promise<T[]> {
    return DatabaseManager.getAll<T>(sql, params);
  },
};
