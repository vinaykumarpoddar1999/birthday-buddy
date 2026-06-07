import { backupService } from '@/services/backup/backup.service';
import { settingsRepository } from '@/repositories/settings.repository';
import type { BackupSettings } from '@features/profile/types';
import { DEFAULT_BACKUP_SETTINGS } from '@/services/profile/profile.service';

export const BACKGROUND_BACKUP_TASK = 'background-auto-backup';

/** Background auto-backup registration removed; foreground backup flows remain available. */
export async function syncBackupScheduler(_autoBackup: boolean): Promise<void> {
  /* no-op */
}

export async function initializeBackupScheduler(): Promise<void> {
  const raw = await settingsRepository.getJson<Partial<BackupSettings>>('backup_settings');
  const autoBackup = raw?.autoBackup ?? DEFAULT_BACKUP_SETTINGS.autoBackup;
  if (autoBackup) {
    try {
      await backupService.exportJson();
    } catch {
      /* best-effort warm-up only */
    }
  }
}
