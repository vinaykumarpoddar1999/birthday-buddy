import * as SecureStore from 'expo-secure-store';

const KEYS = {
  SESSION_TOKEN: 'bb_auth_session_token',
  SESSION_USER_ID: 'bb_auth_session_user_id',
  SESSION_ID: 'bb_auth_session_id',
  AUTH_STATE: 'bb_auth_state',
  BIOMETRIC_TOKEN: 'bb_auth_biometric_token',
  ONBOARDING_COMPLETE: 'bb_onboarding_complete',
  GUEST_MODE: 'bb_guest_mode',
  ENCRYPTION_KEY: 'bb_auth_encryption_key',
  REMEMBER_DEVICE: 'bb_remember_device',
} as const;

export class SecureAuthStorage {
  async getSessionToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.SESSION_TOKEN);
  }

  async setSessionToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.SESSION_TOKEN, token);
  }

  async getSessionUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.SESSION_USER_ID);
  }

  async setSessionUserId(userId: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.SESSION_USER_ID, userId);
  }

  async getSessionId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.SESSION_ID);
  }

  async setSessionId(sessionId: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.SESSION_ID, sessionId);
  }

  async getBiometricToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.BIOMETRIC_TOKEN);
  }

  async setBiometricToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.BIOMETRIC_TOKEN, token);
  }

  async clearBiometricToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.BIOMETRIC_TOKEN);
  }

  async isOnboardingComplete(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  }

  async setOnboardingComplete(complete: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.ONBOARDING_COMPLETE, complete ? 'true' : 'false');
  }

  async isGuestMode(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(KEYS.GUEST_MODE);
    return value === 'true';
  }

  async setGuestMode(guest: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.GUEST_MODE, guest ? 'true' : 'false');
  }

  async getRememberDevice(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(KEYS.REMEMBER_DEVICE);
    return value !== 'false';
  }

  async setRememberDevice(remember: boolean): Promise<void> {
    await SecureStore.setItemAsync(KEYS.REMEMBER_DEVICE, remember ? 'true' : 'false');
  }

  async clearSession(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.SESSION_TOKEN),
      SecureStore.deleteItemAsync(KEYS.SESSION_USER_ID),
      SecureStore.deleteItemAsync(KEYS.SESSION_ID),
      SecureStore.deleteItemAsync(KEYS.AUTH_STATE),
    ]);
  }

  async clearAll(): Promise<void> {
    await Promise.all([
      this.clearSession(),
      SecureStore.deleteItemAsync(KEYS.BIOMETRIC_TOKEN),
      SecureStore.deleteItemAsync(KEYS.ONBOARDING_COMPLETE),
      SecureStore.deleteItemAsync(KEYS.GUEST_MODE),
      SecureStore.deleteItemAsync(KEYS.REMEMBER_DEVICE),
    ]);
  }
}

export const secureAuthStorage = new SecureAuthStorage();
