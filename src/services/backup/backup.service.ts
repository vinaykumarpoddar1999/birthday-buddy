import { pickDocumentAsync } from '@/utils/document-picker';
import { downloadCsvFile, downloadJsonFile, type SaveToDeviceResult } from '@/utils/file-download';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import {
  exportDatabaseBytes,
  exportJsonSnapshot,
  exportModuleCsv,
  exportModuleJson,
  importJsonSnapshot,
  type ExportModule,
} from '@/database/backup';
import { hydrateAppStores } from '@/database/store-hydration';
import { queryClient } from '@/lib/react-query';
import { peopleQueryKeys } from '@features/people/hooks/usePeople';
import { settingsRepository } from '@/repositories/settings.repository';
import { BackupError, ImportError } from '@/shared/errors';
import { generateUuidSync } from '@/utils/uuid';
import { DatabaseManager } from '@/database/database-manager';

const BACKUP_META_KEY = 'last_backup_json';

export type BackupHistoryEntry = {
  id: string;
  backupType: 'json' | 'sqlite' | 'manual' | 'auto';
  fileName: string;
  fileSize: number;
  modules: string[];
  status: 'completed' | 'failed';
  createdAt: string;
};

export type ExportHistoryEntry = {
  id: string;
  exportType: string;
  module: string;
  fileName: string;
  fileSize: number;
  format: 'json' | 'csv' | 'sqlite';
  status: 'completed' | 'failed';
  createdAt: string;
};

export class BackupService {
  async exportJson(): Promise<string> {
    const json = await exportJsonSnapshot();
    await this.recordBackupMeta(json.length);
    await this.addBackupHistory('json', `backup-${Date.now()}.json`, json.length, ['all']);
    return json;
  }

  async downloadJsonBackup(): Promise<SaveToDeviceResult> {
    const json = await this.exportJson();
    const fileName = `birthday-buddy-backup-${Date.now()}.json`;
    return downloadJsonFile(json, fileName);
  }

  /** @deprecated Use downloadJsonBackup */
  async shareJsonBackup(): Promise<SaveToDeviceResult> {
    return this.downloadJsonBackup();
  }

  async downloadModuleExport(
    module: ExportModule,
    format: 'json' | 'csv' = 'json',
  ): Promise<SaveToDeviceResult> {
    const content = format === 'csv' ? await exportModuleCsv(module) : await exportModuleJson(module);
    const ext = format === 'csv' ? 'csv' : 'json';
    const fileName = `birthday-buddy-${module}-${Date.now()}.${ext}`;
    const result =
      format === 'csv' ? await downloadCsvFile(content, fileName) : await downloadJsonFile(content, fileName);
    await this.addExportHistory(module, fileName, content.length, format);
    return result;
  }

  async shareModuleExport(module: ExportModule, format: 'json' | 'csv' = 'json'): Promise<SaveToDeviceResult> {
    return this.downloadModuleExport(module, format);
  }

  async restoreFromPicker(): Promise<void> {
    const result = await pickDocumentAsync({
      type: ['application/json', 'text/json', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled || !result.assets[0]) {
      throw new ImportError('Restore cancelled.');
    }
    const uri = result.assets[0].uri;
    const json = await FileSystem.readAsStringAsync(uri);
    await importJsonSnapshot(json);
    await hydrateAppStores();
    await queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all });
    await queryClient.invalidateQueries({ queryKey: ['calendar'] });
    await queryClient.invalidateQueries({ queryKey: ['wish-history'] });
    await this.addBackupHistory('json', result.assets[0].name ?? 'restore.json', json.length, ['all'], 'completed');
  }

  async previewImport(uri: string): Promise<{ people: number; wishes: number; cards: number; settings: number }> {
    const json = await FileSystem.readAsStringAsync(uri);
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      throw new ImportError('Invalid JSON backup file.');
    }
    const data = parsed as Record<string, unknown> & {
      people?: unknown[];
      wishes?: unknown[];
      wishHistory?: unknown[];
      cards?: unknown[];
      settings?: unknown[];
      module?: string;
    };

    if (data.module && data.module !== 'all') {
      throw new ImportError(
        'This is a partial module export. Use Import Data only with a full backup (Backup Now or Export All Data).',
      );
    }

    if (!Array.isArray(data.people)) {
      throw new ImportError('Invalid backup file: missing people data. Use a full BirthdayBuddy JSON backup.');
    }
    return {
      people: data.people.length,
      wishes: (data.wishes?.length ?? 0) + (data.wishHistory?.length ?? 0),
      cards: data.cards?.length ?? 0,
      settings: data.settings?.length ?? 0,
    };
  }

  async importFromUri(uri: string): Promise<void> {
    const json = await FileSystem.readAsStringAsync(uri);
    await importJsonSnapshot(json);
    await hydrateAppStores();
    await queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all });
    await queryClient.invalidateQueries({ queryKey: ['calendar'] });
    await queryClient.invalidateQueries({ queryKey: ['wish-history'] });
    await queryClient.invalidateQueries({ queryKey: ['card-history'] });
    await this.recordBackupMeta(json.length);
  }

  async exportSqlite(): Promise<Uint8Array> {
    return exportDatabaseBytes();
  }

  async shareSqliteBackup(): Promise<void> {
    const bytes = await this.exportSqlite();
    const dir = FileSystem.cacheDirectory;
    if (!dir) throw new BackupError('Cache directory unavailable');
    const path = `${dir}birthday-buddy-${Date.now()}.db`;
    const base64 = bytesToBase64(bytes);
    await FileSystem.writeAsStringAsync(path, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) throw new BackupError('Sharing is not available');
    await Sharing.shareAsync(path, { mimeType: 'application/octet-stream' });
    await this.addBackupHistory('sqlite', path.split('/').pop() ?? 'backup.db', bytes.length, ['all']);
  }

  async getLastBackupMeta(): Promise<{ exportedAt: string; sizeBytes: number } | null> {
    return settingsRepository.getJson(BACKUP_META_KEY);
  }

  async listBackupHistory(limit = 20): Promise<BackupHistoryEntry[]> {
    const rows = await DatabaseManager.getAll<{
      uuid: string;
      backup_type: string;
      file_name: string | null;
      file_size: number;
      modules: string;
      status: string;
      created_at: string;
    }>(
      `SELECT uuid, backup_type, file_name, file_size, modules, status, created_at
       FROM backup_history WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );
    return rows.map((r) => ({
      id: r.uuid,
      backupType: r.backup_type as BackupHistoryEntry['backupType'],
      fileName: r.file_name ?? 'backup.json',
      fileSize: r.file_size,
      modules: JSON.parse(r.modules || '[]') as string[],
      status: r.status as 'completed' | 'failed',
      createdAt: r.created_at,
    }));
  }

  async listExportHistory(limit = 20): Promise<ExportHistoryEntry[]> {
    const rows = await DatabaseManager.getAll<{
      uuid: string;
      export_type: string;
      module: string;
      file_name: string | null;
      file_size: number;
      format: string;
      status: string;
      created_at: string;
    }>(
      `SELECT uuid, export_type, module, file_name, file_size, format, status, created_at
       FROM export_history WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT ?`,
      [limit],
    );
    return rows.map((r) => ({
      id: r.uuid,
      exportType: r.export_type,
      module: r.module,
      fileName: r.file_name ?? 'export.json',
      fileSize: r.file_size,
      format: r.format as ExportHistoryEntry['format'],
      status: r.status as 'completed' | 'failed',
      createdAt: r.created_at,
    }));
  }

  async deleteBackupHistory(id: string): Promise<void> {
    await DatabaseManager.run(
      'UPDATE backup_history SET is_deleted = 1, deleted_at = ? WHERE uuid = ?',
      [new Date().toISOString(), id],
    );
  }

  private async recordBackupMeta(sizeBytes: number): Promise<void> {
    await settingsRepository.setJson(BACKUP_META_KEY, {
      exportedAt: new Date().toISOString(),
      sizeBytes,
    });
  }

  private async addBackupHistory(
    backupType: BackupHistoryEntry['backupType'],
    fileName: string,
    fileSize: number,
    modules: string[],
    status: 'completed' | 'failed' = 'completed',
  ): Promise<void> {
    const now = new Date().toISOString();
    const uuid = generateUuidSync();
    await DatabaseManager.run(
      `INSERT INTO backup_history (uuid, created_at, updated_at, backup_type, file_name, file_size, modules, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuid, now, now, backupType, fileName, fileSize, JSON.stringify(modules), status],
    );
  }

  private async addExportHistory(
    module: string,
    fileName: string,
    fileSize: number,
    format: 'json' | 'csv' | 'sqlite',
  ): Promise<void> {
    const now = new Date().toISOString();
    const uuid = generateUuidSync();
    await DatabaseManager.run(
      `INSERT INTO export_history (uuid, created_at, updated_at, export_type, module, file_name, file_size, format, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuid, now, now, 'manual', module, fileName, fileSize, format, 'completed'],
    );
  }
}

export const backupService = new BackupService();

function bytesToBase64(bytes: Uint8Array): string {
  const chunkSize = 8192;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}
