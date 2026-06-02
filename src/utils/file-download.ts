import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export type SaveToDeviceMethod = 'downloads' | 'share' | 'cache';

export type SaveToDeviceResult = {
  path: string;
  method: SaveToDeviceMethod;
};

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[/\\?%*:|"<>]/g, '_');
}

async function trySaveToDownloads(path: string): Promise<boolean> {
  try {
    const { granted } = await MediaLibrary.requestPermissionsAsync(true);
    if (!granted) return false;

    const asset = await MediaLibrary.createAssetAsync(path);
    if (Platform.OS === 'android') {
      const downloadAlbum = await MediaLibrary.getAlbumAsync('Download');
      if (downloadAlbum) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], downloadAlbum, false);
      } else {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      }
    } else {
      await MediaLibrary.saveToLibraryAsync(path);
    }
    return true;
  } catch {
    return false;
  }
}

async function tryShareFile(path: string, mimeType: string): Promise<boolean> {
  try {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return false;
    await Sharing.shareAsync(path, {
      mimeType,
      dialogTitle: 'Birthday Buddy Export',
    });
    return true;
  } catch {
    return false;
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

  const path = `${dir}${sanitizeFileName(fileName)}`;
  await FileSystem.writeAsStringAsync(path, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const savedToDownloads = await trySaveToDownloads(path);
  if (savedToDownloads) {
    return { path, method: 'downloads' };
  }

  const shared = await tryShareFile(path, mimeType);
  if (shared) {
    return { path, method: 'share' };
  }

  return { path, method: 'cache' };
}
