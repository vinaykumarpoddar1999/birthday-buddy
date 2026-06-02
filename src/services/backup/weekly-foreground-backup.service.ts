import * as FileSystem from 'expo-file-system/legacy';
import Constants from 'expo-constants';

import { settingsRepository } from '@/repositories/settings.repository';
import { backupService } from '@/services/backup/backup.service';
import { DEFAULT_BACKUP_SETTINGS } from '@/services/profile/profile.service';
import type { BackupSettings } from '@features/profile/types';
import { useSettingsStore } from '@/stores/settings.store';

const LAST_AUTO_BACKUP_KEY = 'last_auto_backup_run';

function daysSince(iso: string | null): number {
  if (!iso) return 999;
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

async function saveBackupToAppDocuments(json: string, fileName: string): Promise<void> {
  const dir = `${FileSystem.documentDirectory}auto-backups/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  await FileSystem.writeAsStringAsync(`${dir}${fileName}`, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

export async function runWeeklyForegroundBackupIfDue(): Promise<void> {
  const raw = await settingsRepository.getJson<Partial<BackupSettings>>('backup_settings');
  const autoBackup = raw?.autoBackup ?? DEFAULT_BACKUP_SETTINGS.autoBackup;
  if (!autoBackup) return;

  const lastRun = await settingsRepository.get(LAST_AUTO_BACKUP_KEY);
  const lastBackupDate = raw?.lastBackupDate ?? null;
  const days = Math.max(daysSince(lastRun), daysSince(lastBackupDate));
  if (days < 7) return;

  try {
    const isExpoGo = Constants.appOwnership === 'expo';
    if (!isExpoGo) {
      await backupService.downloadJsonBackup();
    } else {
      const json = await backupService.exportJson();
      const fileName = `birthday-buddy-auto-${Date.now()}.json`;
      await saveBackupToAppDocuments(json, fileName);
    }

    const now = new Date().toISOString();
    await settingsRepository.set(LAST_AUTO_BACKUP_KEY, now);
    const nextSettings: BackupSettings = {
      ...DEFAULT_BACKUP_SETTINGS,
      ...raw,
      autoBackup: true,
      lastBackupDate: now,
      backupStatus: 'completed',
    };
    await settingsRepository.setJson('backup_settings', nextSettings);
    useSettingsStore.getState().updateBackupSettings({
      lastBackupDate: now,
      backupStatus: 'completed',
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[backup] Weekly foreground backup failed:', error);
    }
  }
}
