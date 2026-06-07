import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'bb_device_id';
const ENCRYPTION_KEY_KEY = 'bb_encryption_key';

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const { randomUUID } = await import('expo-crypto');
  const id = randomUUID();
  await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

export async function getEncryptionKey(): Promise<string | null> {
  return AsyncStorage.getItem(ENCRYPTION_KEY_KEY);
}

export async function setEncryptionKey(key: string): Promise<void> {
  await AsyncStorage.setItem(ENCRYPTION_KEY_KEY, key);
}
