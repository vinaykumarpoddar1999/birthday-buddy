import type { Migration } from '../types';
import { BASE_ENTITY_COLUMNS } from '../types';

export const migration012AuthSecurityTables: Migration = {
  version: 12,
  name: 'auth_security_tables',
  up: async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        ${BASE_ENTITY_COLUMNS},
        email TEXT,
        phone TEXT,
        full_name TEXT NOT NULL DEFAULT '',
        nickname TEXT NOT NULL DEFAULT '',
        profile_photo TEXT,
        date_of_birth TEXT NOT NULL DEFAULT '',
        gender TEXT NOT NULL DEFAULT 'other',
        country TEXT NOT NULL DEFAULT '',
        timezone TEXT NOT NULL DEFAULT 'UTC',
        preferred_language TEXT NOT NULL DEFAULT 'english',
        terms_accepted_at TEXT,
        privacy_accepted_at TEXT,
        account_status TEXT NOT NULL DEFAULT 'active',
        last_login_at TEXT,
        cloud_user_id TEXT
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL AND email != '' AND is_deleted = 0;
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL AND phone != '' AND is_deleted = 0;

      CREATE TABLE IF NOT EXISTS user_security (
        ${BASE_ENTITY_COLUMNS},
        user_uuid TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        password_salt TEXT,
        pin_hash TEXT,
        pin_salt TEXT,
        pin_length INTEGER NOT NULL DEFAULT 0,
        recovery_code_hash TEXT,
        recovery_code_salt TEXT,
        security_question TEXT,
        security_answer_hash TEXT,
        security_answer_salt TEXT,
        backup_pin_hash TEXT,
        backup_pin_salt TEXT,
        failed_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until TEXT,
        last_password_change_at TEXT,
        last_pin_change_at TEXT,
        FOREIGN KEY (user_uuid) REFERENCES users(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_user_security_user ON user_security(user_uuid);

      CREATE TABLE IF NOT EXISTS user_sessions (
        ${BASE_ENTITY_COLUMNS},
        user_uuid TEXT NOT NULL,
        session_token_hash TEXT NOT NULL,
        device_name TEXT NOT NULL DEFAULT '',
        platform TEXT NOT NULL DEFAULT '',
        auth_method TEXT NOT NULL DEFAULT 'password',
        is_active INTEGER NOT NULL DEFAULT 1,
        expires_at TEXT,
        last_validated_at TEXT NOT NULL,
        last_activity_at TEXT NOT NULL,
        refresh_count INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_uuid) REFERENCES users(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_uuid);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active, user_uuid);

      CREATE TABLE IF NOT EXISTS security_preferences (
        ${BASE_ENTITY_COLUMNS},
        user_uuid TEXT NOT NULL UNIQUE,
        primary_auth_method TEXT NOT NULL DEFAULT 'password',
        enabled_methods TEXT NOT NULL DEFAULT '["password"]',
        biometric_enabled INTEGER NOT NULL DEFAULT 0,
        face_id_enabled INTEGER NOT NULL DEFAULT 0,
        fingerprint_enabled INTEGER NOT NULL DEFAULT 0,
        device_passcode_enabled INTEGER NOT NULL DEFAULT 0,
        app_lock_enabled INTEGER NOT NULL DEFAULT 0,
        pin_enabled INTEGER NOT NULL DEFAULT 0,
        remember_device INTEGER NOT NULL DEFAULT 1,
        auto_lock_timer TEXT NOT NULL DEFAULT '5',
        lock_on_background INTEGER NOT NULL DEFAULT 1,
        lock_on_restart INTEGER NOT NULL DEFAULT 1,
        lock_after_inactivity INTEGER NOT NULL DEFAULT 1,
        combined_auth_required INTEGER NOT NULL DEFAULT 0,
        combined_auth_methods TEXT NOT NULL DEFAULT '[]',
        permissions_granted TEXT NOT NULL DEFAULT '{}',
        onboarding_completed INTEGER NOT NULL DEFAULT 0,
        security_setup_completed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_uuid) REFERENCES users(uuid)
      );

      CREATE TABLE IF NOT EXISTS login_history (
        ${BASE_ENTITY_COLUMNS},
        user_uuid TEXT NOT NULL,
        session_uuid TEXT,
        login_at TEXT NOT NULL,
        logout_at TEXT,
        device_name TEXT NOT NULL DEFAULT '',
        auth_method TEXT NOT NULL DEFAULT 'password',
        success INTEGER NOT NULL DEFAULT 1,
        failure_reason TEXT,
        ip_address TEXT,
        FOREIGN KEY (user_uuid) REFERENCES users(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_login_history_user ON login_history(user_uuid);
      CREATE INDEX IF NOT EXISTS idx_login_history_login_at ON login_history(login_at);

      CREATE TABLE IF NOT EXISTS device_registry (
        ${BASE_ENTITY_COLUMNS},
        user_uuid TEXT NOT NULL,
        device_name TEXT NOT NULL DEFAULT '',
        platform TEXT NOT NULL DEFAULT '',
        os_version TEXT NOT NULL DEFAULT '',
        app_version TEXT NOT NULL DEFAULT '',
        is_trusted INTEGER NOT NULL DEFAULT 1,
        is_current INTEGER NOT NULL DEFAULT 0,
        last_seen_at TEXT NOT NULL,
        registered_at TEXT NOT NULL,
        biometric_capable INTEGER NOT NULL DEFAULT 0,
        UNIQUE(user_uuid, device_id),
        FOREIGN KEY (user_uuid) REFERENCES users(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_device_registry_user ON device_registry(user_uuid);
    `);
  },
};
