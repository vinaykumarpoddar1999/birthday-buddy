import { BaseRepository } from './base-repository';
import type { AuthMethod, AutoLockTimer, SecurityPreferences } from '@features/auth/types/auth.types';

interface SecurityPrefsRow {
  uuid: string;
  user_uuid: string;
  primary_auth_method: string;
  enabled_methods: string;
  biometric_enabled: number;
  face_id_enabled: number;
  fingerprint_enabled: number;
  device_passcode_enabled: number;
  app_lock_enabled: number;
  pin_enabled: number;
  remember_device: number;
  auto_lock_timer: string;
  lock_on_background: number;
  lock_on_restart: number;
  lock_after_inactivity: number;
  combined_auth_required: number;
  combined_auth_methods: string;
  permissions_granted: string;
  onboarding_completed: number;
  security_setup_completed: number;
}

export const DEFAULT_SECURITY_PREFERENCES: SecurityPreferences = {
  primaryAuthMethod: 'email_password',
  enabledMethods: ['email_password'],
  biometricEnabled: false,
  faceIdEnabled: false,
  fingerprintEnabled: false,
  devicePasscodeEnabled: false,
  appLockEnabled: false,
  pinEnabled: false,
  pinLength: 0,
  rememberDevice: true,
  autoLockTimer: '5',
  lockOnBackground: false,
  lockOnRestart: false,
  lockAfterInactivity: false,
  combinedAuthRequired: false,
  combinedAuthMethods: [],
  permissionsGranted: {},
  onboardingCompleted: false,
  securitySetupCompleted: false,
};

export class SecurityPreferencesRepository extends BaseRepository {
  private mapRow(row: SecurityPrefsRow, pinLength = 0): SecurityPreferences {
    return {
      primaryAuthMethod: row.primary_auth_method as AuthMethod,
      enabledMethods: JSON.parse(row.enabled_methods || '[]') as AuthMethod[],
      biometricEnabled: row.biometric_enabled === 1,
      faceIdEnabled: row.face_id_enabled === 1,
      fingerprintEnabled: row.fingerprint_enabled === 1,
      devicePasscodeEnabled: row.device_passcode_enabled === 1,
      appLockEnabled: row.app_lock_enabled === 1,
      pinEnabled: row.pin_enabled === 1,
      pinLength: pinLength as 0 | 4 | 6,
      rememberDevice: row.remember_device === 1,
      autoLockTimer: row.auto_lock_timer as AutoLockTimer,
      lockOnBackground: row.lock_on_background === 1,
      lockOnRestart: row.lock_on_restart === 1,
      lockAfterInactivity: row.lock_after_inactivity === 1,
      combinedAuthRequired: row.combined_auth_required === 1,
      combinedAuthMethods: JSON.parse(row.combined_auth_methods || '[]') as AuthMethod[],
      permissionsGranted: JSON.parse(row.permissions_granted || '{}') as Record<string, boolean>,
      onboardingCompleted: row.onboarding_completed === 1,
      securitySetupCompleted: row.security_setup_completed === 1,
    };
  }

  async create(userUuid: string, prefs?: Partial<SecurityPreferences>): Promise<void> {
    const uuid = this.newUuid();
    const now = this.now();
    const merged = { ...DEFAULT_SECURITY_PREFERENCES, ...prefs };
    await this.run(
      `INSERT INTO security_preferences (
        uuid, created_at, updated_at, device_id, sync_status,
        user_uuid, primary_auth_method, enabled_methods,
        biometric_enabled, face_id_enabled, fingerprint_enabled,
        device_passcode_enabled, app_lock_enabled, pin_enabled,
        remember_device, auto_lock_timer, lock_on_background,
        lock_on_restart, lock_after_inactivity, combined_auth_required,
        combined_auth_methods, permissions_granted,
        onboarding_completed, security_setup_completed
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        userUuid,
        merged.primaryAuthMethod,
        JSON.stringify(merged.enabledMethods),
        merged.biometricEnabled ? 1 : 0,
        merged.faceIdEnabled ? 1 : 0,
        merged.fingerprintEnabled ? 1 : 0,
        merged.devicePasscodeEnabled ? 1 : 0,
        merged.appLockEnabled ? 1 : 0,
        merged.pinEnabled ? 1 : 0,
        merged.rememberDevice ? 1 : 0,
        merged.autoLockTimer,
        merged.lockOnBackground ? 1 : 0,
        merged.lockOnRestart ? 1 : 0,
        merged.lockAfterInactivity ? 1 : 0,
        merged.combinedAuthRequired ? 1 : 0,
        JSON.stringify(merged.combinedAuthMethods),
        JSON.stringify(merged.permissionsGranted),
        merged.onboardingCompleted ? 1 : 0,
        merged.securitySetupCompleted ? 1 : 0,
      ],
    );
  }

  async findByUserUuid(userUuid: string, pinLength = 0): Promise<SecurityPreferences | null> {
    const row = await this.getFirst<SecurityPrefsRow>(
      `SELECT * FROM security_preferences WHERE user_uuid = ? AND ${this.notDeletedClause()}`,
      [userUuid],
    );
    return row ? this.mapRow(row, pinLength) : null;
  }

  async update(userUuid: string, prefs: Partial<SecurityPreferences>): Promise<void> {
    const existing = await this.findByUserUuid(userUuid);
    if (!existing) return;
    const merged = { ...existing, ...prefs };
    const now = this.now();

    await this.run(
      `UPDATE security_preferences SET
        primary_auth_method = ?, enabled_methods = ?,
        biometric_enabled = ?, face_id_enabled = ?, fingerprint_enabled = ?,
        device_passcode_enabled = ?, app_lock_enabled = ?, pin_enabled = ?,
        remember_device = ?, auto_lock_timer = ?,
        lock_on_background = ?, lock_on_restart = ?, lock_after_inactivity = ?,
        combined_auth_required = ?, combined_auth_methods = ?,
        permissions_granted = ?, onboarding_completed = ?,
        security_setup_completed = ?, updated_at = ?
      WHERE user_uuid = ?`,
      [
        merged.primaryAuthMethod,
        JSON.stringify(merged.enabledMethods),
        merged.biometricEnabled ? 1 : 0,
        merged.faceIdEnabled ? 1 : 0,
        merged.fingerprintEnabled ? 1 : 0,
        merged.devicePasscodeEnabled ? 1 : 0,
        merged.appLockEnabled ? 1 : 0,
        merged.pinEnabled ? 1 : 0,
        merged.rememberDevice ? 1 : 0,
        merged.autoLockTimer,
        merged.lockOnBackground ? 1 : 0,
        merged.lockOnRestart ? 1 : 0,
        merged.lockAfterInactivity ? 1 : 0,
        merged.combinedAuthRequired ? 1 : 0,
        JSON.stringify(merged.combinedAuthMethods),
        JSON.stringify(merged.permissionsGranted),
        merged.onboardingCompleted ? 1 : 0,
        merged.securitySetupCompleted ? 1 : 0,
        now,
        userUuid,
      ],
    );
  }

  async hardDeleteAll(): Promise<void> {
    await this.run(`DELETE FROM security_preferences`);
  }
}

export const securityPreferencesRepository = new SecurityPreferencesRepository();
