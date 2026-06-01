import * as SecureStore from 'expo-secure-store';

const DEVICE_ID_KEY = 'bb_device_id';
const ENCRYPTION_KEY_KEY = 'bb_encryption_key';

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (existing) return existing;

  const { randomUUID } = await import('expo-crypto');
  const id = randomUUID();
  await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  return id;
}

export async function getEncryptionKey(): Promise<string | null> {
  return SecureStore.getItemAsync(ENCRYPTION_KEY_KEY);
}

export async function setEncryptionKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(ENCRYPTION_KEY_KEY, key);
}
