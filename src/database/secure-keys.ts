import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = 'bb_device_id';
const ENCRYPTION_KEY_KEY = 'bb_encryption_key';

async function getSensitiveItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

async function setSensitiveItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore web storage errors.
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const { randomUUID } = await import('expo-crypto');
  const id = randomUUID();
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

export async function getEncryptionKey(): Promise<string | null> {
  return getSensitiveItem(ENCRYPTION_KEY_KEY);
}

export async function setEncryptionKey(key: string): Promise<void> {
  await setSensitiveItem(ENCRYPTION_KEY_KEY, key);
}
