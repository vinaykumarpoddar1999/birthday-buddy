import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';

export type SaveToDeviceMethod = 'downloads' | 'documents' | 'share' | 'cache';

export type SaveToDeviceResult = {
  path: string;
  method: SaveToDeviceMethod;
  displayPath?: string;
};

const SAF_DIRECTORY_KEY = 'export_saf_directory_uri';

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[/\\?%*:|"<>]/g, '_');
}

function mimeTypeForFileName(fileName: string): string {
  if (fileName.endsWith('.csv')) return 'text/csv';
  return 'application/json';
}

async function trySaveToAndroidDownloads(
  path: string,
  fileName: string,
  mimeType: string,
): Promise<string | null> {
  if (Platform.OS !== 'android') return null;

  try {
    let directoryUri = await settingsRepository.get(SAF_DIRECTORY_KEY);
    if (!directoryUri) {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) return null;
      directoryUri = permissions.directoryUri;
      await settingsRepository.set(SAF_DIRECTORY_KEY, directoryUri);
    }

    const base64 = await FileSystem.readAsStringAsync(path, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
      directoryUri,
      fileName,
      mimeType,
    );
    await FileSystem.writeAsStringAsync(destUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return destUri;
  } catch {
    await settingsRepository.set(SAF_DIRECTORY_KEY, '');
    return null;
  }
}

async function trySaveToDocuments(path: string, fileName: string): Promise<string | null> {
  const docDir = FileSystem.documentDirectory;
  if (!docDir) return null;

  try {
    const downloadsDir = `${docDir}Downloads/`;
    const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
    }
    const destPath = `${downloadsDir}${sanitizeFileName(fileName)}`;
    const existing = await FileSystem.getInfoAsync(destPath);
    if (existing.exists) {
      await FileSystem.deleteAsync(destPath, { idempotent: true });
    }
    await FileSystem.copyAsync({ from: path, to: destPath });
    return destPath;
  } catch {
    return null;
  }
}

export async function saveToDevice(
  content: string,
  fileName: string,
  mimeType: string,
): Promise<SaveToDeviceResult> {
  const dir = FileSystem.cacheDirectory;
  if (!dir) {
    throw new Error('Cache directory unavailable');
  }

  const safeName = sanitizeFileName(fileName);
  const resolvedMime = mimeType || mimeTypeForFileName(safeName);
  const path = `${dir}${safeName}`;
  await FileSystem.writeAsStringAsync(path, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const androidUri = await trySaveToAndroidDownloads(path, safeName, resolvedMime);
  if (androidUri) {
    return { path: androidUri, method: 'downloads', displayPath: safeName };
  }

  const documentsPath = await trySaveToDocuments(path, safeName);
  if (documentsPath) {
    return { path: documentsPath, method: 'documents', displayPath: safeName };
  }

  return { path, method: 'cache', displayPath: safeName };
}

export async function downloadJsonFile(content: string, fileName: string): Promise<SaveToDeviceResult> {
  return saveToDevice(content, fileName, 'application/json');
}

export async function downloadCsvFile(content: string, fileName: string): Promise<SaveToDeviceResult> {
  return saveToDevice(content, fileName, 'text/csv');
}

export function getSaveSuccessMessage(result: SaveToDeviceResult): string {
  switch (result.method) {
    case 'downloads':
      return `Saved to your chosen folder as ${result.displayPath ?? 'backup file'}.`;
    case 'documents':
      return Platform.OS === 'ios'
        ? `Saved to Files (On My iPhone → BirthdayBuddy → Downloads) as ${result.displayPath ?? 'backup file'}.`
        : `Saved to app Downloads folder as ${result.displayPath ?? 'backup file'}.`;
    default:
      return `File saved at ${result.displayPath ?? result.path}. Open your device file manager to access it.`;
  }
}
