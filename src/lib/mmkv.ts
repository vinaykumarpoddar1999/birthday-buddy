/**
 * In-memory storage stub for Expo Go (no native MMKV / nitro modules).
 * Replace with react-native-mmkv when using a development build.
 */

type StorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getString: (key) => map.get(key),
    set: (key, value) => {
      map.set(key, value);
    },
    remove: (key) => {
      map.delete(key);
    },
  };
}

export const storage = createMemoryStorage();
export const cacheStorage = createMemoryStorage();
export const settingsStorage = createMemoryStorage();

export function getString(key: string): string | undefined {
  return storage.getString(key);
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function remove(key: string): void {
  storage.remove(key);
}
