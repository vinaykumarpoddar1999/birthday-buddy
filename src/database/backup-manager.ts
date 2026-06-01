import {
  exportDatabaseBytes,
  exportJsonSnapshot,
  importDatabaseBytes,
  type AppBackupSnapshot,
} from './backup';

export const BackupManager = {
  exportDatabaseBytes,
  exportJsonSnapshot,
  importDatabaseBytes,
};

export type { AppBackupSnapshot };
