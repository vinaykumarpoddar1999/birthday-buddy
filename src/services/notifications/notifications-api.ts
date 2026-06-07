import Constants from 'expo-constants';

export type NotificationsModule = typeof import('expo-notifications');

const isExpoGo = Constants.appOwnership === 'expo';

let modulePromise: Promise<NotificationsModule | null> | null = null;
let cachedModule: NotificationsModule | null = null;

/**
 * Lazy-loads expo-notifications to avoid push auto-registration at app startup.
 * In Expo Go, local scheduling may still work after first load; push is unsupported.
 */
export async function getNotificationsModule(forceReload = false): Promise<NotificationsModule | null> {
  if (cachedModule && !forceReload) return cachedModule;

  if (forceReload) {
    modulePromise = null;
    cachedModule = null;
  }

  if (!modulePromise) {
    modulePromise = (async () => {
      try {
        const mod = await import('expo-notifications');
        cachedModule = mod;
        return mod;
      } catch (error) {
        if (__DEV__) {
          console.warn('[notifications] Failed to load expo-notifications:', error);
        }
        modulePromise = null;
        return null;
      }
    })();
  }

  return modulePromise;
}

export function isExpoGoNotifications(): boolean {
  return isExpoGo;
}
