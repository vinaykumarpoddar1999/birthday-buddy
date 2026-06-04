import type { AutoLockTimer, SecurityPreferences } from '@features/auth/types/auth.types';

export type AppLockState = {
  isLocked: boolean;
  lastActivityAt: number;
  backgroundedAt: number | null;
};

const AUTO_LOCK_MS: Record<AutoLockTimer, number | null> = {
  immediate: 0,
  '1': 60_000,
  '5': 300_000,
  '15': 900_000,
  '30': 1_800_000,
  '60': 3_600_000,
  never: null,
};

class AppLockServiceClass {
  private state: AppLockState = {
    isLocked: false,
    lastActivityAt: Date.now(),
    backgroundedAt: null,
  };

  /** Set when a cold-start lock has been requested (prevents duplicate startup locks). */
  private startupLockConsumed = false;
  private hasUnlockedThisSession = false;

  private listeners = new Set<(state: AppLockState) => void>();

  subscribe(listener: (state: AppLockState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState(): AppLockState {
    return { ...this.state };
  }

  recordActivity(): void {
    this.state = { ...this.state, lastActivityAt: Date.now() };
    this.notify();
  }

  lock(): void {
    this.state = { ...this.state, isLocked: true };
    this.notify();
  }

  unlock(): void {
    this.hasUnlockedThisSession = true;
    this.state = {
      isLocked: false,
      lastActivityAt: Date.now(),
      backgroundedAt: null,
    };
    this.notify();
  }

  /**
   * Returns true only once per cold start when app lock should show before first unlock.
   * Safe to call from hydrate and AppLockProvider without re-locking after successful auth.
   */
  consumeStartupLock(prefs: SecurityPreferences): boolean {
    if (this.startupLockConsumed || this.hasUnlockedThisSession) return false;
    if (!prefs.appLockEnabled || !prefs.lockOnRestart) return false;
    this.startupLockConsumed = true;
    return true;
  }

  onBackground(prefs: SecurityPreferences): void {
    if (!prefs.appLockEnabled) return;
    this.state = { ...this.state, backgroundedAt: Date.now() };
    if (prefs.lockOnBackground && prefs.autoLockTimer === 'immediate') {
      this.lock();
    }
    this.notify();
  }

  onForeground(prefs: SecurityPreferences): boolean {
    if (!prefs.appLockEnabled) {
      this.recordActivity();
      return false;
    }

    if (this.state.backgroundedAt && prefs.lockOnBackground) {
      const elapsed = Date.now() - this.state.backgroundedAt;
      const threshold = AUTO_LOCK_MS[prefs.autoLockTimer];

      if (threshold === 0 || (threshold !== null && elapsed >= threshold)) {
        this.lock();
        return true;
      }
    }

    this.state = { ...this.state, backgroundedAt: null };
    this.recordActivity();
    return this.state.isLocked;
  }

  shouldLockOnStart(prefs: SecurityPreferences): boolean {
    return this.consumeStartupLock(prefs);
  }

  checkInactivity(prefs: SecurityPreferences): boolean {
    if (!prefs.appLockEnabled || !prefs.lockAfterInactivity) return false;
    const threshold = AUTO_LOCK_MS[prefs.autoLockTimer];
    if (threshold === null) return false;
    const elapsed = Date.now() - this.state.lastActivityAt;
    if (elapsed >= threshold) {
      this.lock();
      return true;
    }
    return false;
  }
}

export const appLockService = new AppLockServiceClass();
