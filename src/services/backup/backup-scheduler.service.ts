import Constants from 'expo-constants';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { backupService } from '@/services/backup/backup.service';
import { settingsRepository } from '@/repositories/settings.repository';
import type { BackupSettings } from '@features/profile/types';
import { DEFAULT_BACKUP_SETTINGS } from '@/services/profile/profile.service';

export const BACKGROUND_BACKUP_TASK = 'background-auto-backup';

const isExpoGo = Constants.appOwnership === 'expo';

TaskManager.defineTask(BACKGROUND_BACKUP_TASK, async () => {
  try {
    const raw = await settingsRepository.getJson<Partial<BackupSettings>>('backup_settings');
    const autoBackup = raw?.autoBackup ?? DEFAULT_BACKUP_SETTINGS.autoBackup;
    if (!autoBackup) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const json = await backupService.exportJson();
    try {
      const FileSystem = await import('expo-file-system/legacy');
      const dir = `${FileSystem.documentDirectory}auto-backups/`;
      const info = await FileSystem.getInfoAsync(dir);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }
      await FileSystem.writeAsStringAsync(
        `${dir}birthday-buddy-auto-${Date.now()}.json`,
        json,
        { encoding: FileSystem.EncodingType.UTF8 },
      );
    } catch {
      /* silent save is best-effort in background */
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function syncBackupScheduler(autoBackup: boolean): Promise<void> {
  if (isExpoGo || autoBackup === false) {
    await unregisterBackupTask();
    return;
  }

  await registerBackupTask();
}

async function registerBackupTask(): Promise<void> {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) return;

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_BACKUP_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_BACKUP_TASK, {
        minimumInterval: 60 * 60 * 24 * 7,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  } catch {
    /* Background fetch unavailable in Expo Go, web, or simulator */
  }
}

async function unregisterBackupTask(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_BACKUP_TASK);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_BACKUP_TASK);
    }
  } catch {
    /* ignore */
  }
}

export async function initializeBackupScheduler(): Promise<void> {
  const raw = await settingsRepository.getJson<Partial<BackupSettings>>('backup_settings');
  const autoBackup = raw?.autoBackup ?? DEFAULT_BACKUP_SETTINGS.autoBackup;
  await syncBackupScheduler(autoBackup);
}
