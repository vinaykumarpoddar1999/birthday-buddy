import { DatabaseManager } from './database-manager';
import { hydrateAppStores } from './store-hydration';

let bootstrapPromise: Promise<void> | null = null;
let bootstrapComplete = false;

/** True after the first successful DB + store hydration (survives provider remounts). */
export function isAppBootstrapComplete(): boolean {
  return bootstrapComplete;
}

export function resetAppBootstrap(): void {
  bootstrapComplete = false;
  bootstrapPromise = null;
}

/**
 * Single-flight app bootstrap. Safe to call from DatabaseProvider, backup restore, etc.
 * Prevents duplicate hydration and loader flicker on React Strict Mode remounts.
 */
export function ensureAppBootstrap(): Promise<void> {
  if (bootstrapComplete) {
    return Promise.resolve();
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      await DatabaseManager.initialize();
      await hydrateAppStores();
      bootstrapComplete = true;
    })().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
}
