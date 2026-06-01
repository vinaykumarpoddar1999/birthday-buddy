import { DatabaseManager } from './database-manager';

/** Wraps multi-statement writes in a SQLite transaction. */
export const TransactionManager = {
  withTransaction<T>(fn: () => Promise<T>): Promise<T> {
    return DatabaseManager.withTransaction(fn);
  },
};
