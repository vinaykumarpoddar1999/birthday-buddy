import { BaseRepository } from './base-repository';

interface UserSecurityRow {
  uuid: string;
  user_uuid: string;
  password_hash: string | null;
  password_salt: string | null;
  pin_hash: string | null;
  pin_salt: string | null;
  pin_length: number;
  recovery_code_hash: string | null;
  recovery_code_salt: string | null;
  security_question: string | null;
  security_answer_hash: string | null;
  security_answer_salt: string | null;
  backup_pin_hash: string | null;
  backup_pin_salt: string | null;
  failed_attempts: number;
  locked_until: string | null;
  last_password_change_at: string | null;
  last_pin_change_at: string | null;
}

export type UserSecurityRecord = {
  id: string;
  userId: string;
  passwordHash: string | null;
  passwordSalt: string | null;
  pinHash: string | null;
  pinSalt: string | null;
  pinLength: number;
  recoveryCodeHash: string | null;
  recoveryCodeSalt: string | null;
  securityQuestion: string | null;
  securityAnswerHash: string | null;
  securityAnswerSalt: string | null;
  backupPinHash: string | null;
  backupPinSalt: string | null;
  failedAttempts: number;
  lockedUntil: string | null;
};

export class UserSecurityRepository extends BaseRepository {
  private mapRow(row: UserSecurityRow): UserSecurityRecord {
    return {
      id: row.uuid,
      userId: row.user_uuid,
      passwordHash: row.password_hash,
      passwordSalt: row.password_salt,
      pinHash: row.pin_hash,
      pinSalt: row.pin_salt,
      pinLength: row.pin_length,
      recoveryCodeHash: row.recovery_code_hash,
      recoveryCodeSalt: row.recovery_code_salt,
      securityQuestion: row.security_question,
      securityAnswerHash: row.security_answer_hash,
      securityAnswerSalt: row.security_answer_salt,
      backupPinHash: row.backup_pin_hash,
      backupPinSalt: row.backup_pin_salt,
      failedAttempts: row.failed_attempts,
      lockedUntil: row.locked_until,
    };
  }

  async create(userUuid: string, passwordHash: string, passwordSalt: string): Promise<void> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO user_security (
        uuid, created_at, updated_at, device_id, sync_status,
        user_uuid, password_hash, password_salt, last_password_change_at
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [uuid, now, now, this.deviceId, userUuid, passwordHash, passwordSalt, now],
    );
  }

  async findByUserUuid(userUuid: string): Promise<UserSecurityRecord | null> {
    const row = await this.getFirst<UserSecurityRow>(
      `SELECT * FROM user_security WHERE user_uuid = ? AND ${this.notDeletedClause()}`,
      [userUuid],
    );
    return row ? this.mapRow(row) : null;
  }

  async updatePassword(userUuid: string, hash: string, salt: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE user_security SET password_hash = ?, password_salt = ?, last_password_change_at = ?, updated_at = ?, failed_attempts = 0, locked_until = NULL WHERE user_uuid = ?`,
      [hash, salt, now, now, userUuid],
    );
  }

  async updatePin(userUuid: string, hash: string, salt: string, pinLength: number): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE user_security SET pin_hash = ?, pin_salt = ?, pin_length = ?, last_pin_change_at = ?, updated_at = ? WHERE user_uuid = ?`,
      [hash, salt, pinLength, now, now, userUuid],
    );
  }

  async clearPin(userUuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE user_security SET pin_hash = NULL, pin_salt = NULL, pin_length = 0, updated_at = ? WHERE user_uuid = ?`,
      [now, userUuid],
    );
  }

  async setRecoveryData(
    userUuid: string,
    data: {
      recoveryCodeHash?: string;
      recoveryCodeSalt?: string;
      securityQuestion?: string;
      securityAnswerHash?: string;
      securityAnswerSalt?: string;
      backupPinHash?: string;
      backupPinSalt?: string;
    },
  ): Promise<void> {
    const now = this.now();
    const fields: string[] = ['updated_at = ?'];
    const params: (string | number | null)[] = [now];

    if (data.recoveryCodeHash !== undefined) {
      fields.push('recovery_code_hash = ?');
      params.push(data.recoveryCodeHash);
    }
    if (data.recoveryCodeSalt !== undefined) {
      fields.push('recovery_code_salt = ?');
      params.push(data.recoveryCodeSalt);
    }
    if (data.securityQuestion !== undefined) {
      fields.push('security_question = ?');
      params.push(data.securityQuestion);
    }
    if (data.securityAnswerHash !== undefined) {
      fields.push('security_answer_hash = ?');
      params.push(data.securityAnswerHash);
    }
    if (data.securityAnswerSalt !== undefined) {
      fields.push('security_answer_salt = ?');
      params.push(data.securityAnswerSalt);
    }
    if (data.backupPinHash !== undefined) {
      fields.push('backup_pin_hash = ?');
      params.push(data.backupPinHash);
    }
    if (data.backupPinSalt !== undefined) {
      fields.push('backup_pin_salt = ?');
      params.push(data.backupPinSalt);
    }

    params.push(userUuid);
    await this.run(`UPDATE user_security SET ${fields.join(', ')} WHERE user_uuid = ?`, params);
  }

  async incrementFailedAttempts(userUuid: string): Promise<number> {
    const security = await this.findByUserUuid(userUuid);
    const attempts = (security?.failedAttempts ?? 0) + 1;
    const now = this.now();
    let lockedUntil: string | null = null;

    if (attempts >= 10) {
      lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    } else if (attempts >= 5) {
      lockedUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    }

    await this.run(
      `UPDATE user_security SET failed_attempts = ?, locked_until = ?, updated_at = ? WHERE user_uuid = ?`,
      [attempts, lockedUntil, now, userUuid],
    );
    return attempts;
  }

  async resetFailedAttempts(userUuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE user_security SET failed_attempts = 0, locked_until = NULL, updated_at = ? WHERE user_uuid = ?`,
      [now, userUuid],
    );
  }

  async isLocked(userUuid: string): Promise<{ locked: boolean; until: string | null }> {
    const security = await this.findByUserUuid(userUuid);
    if (!security?.lockedUntil) return { locked: false, until: null };
    if (new Date(security.lockedUntil) > new Date()) {
      return { locked: true, until: security.lockedUntil };
    }
    await this.resetFailedAttempts(userUuid);
    return { locked: false, until: null };
  }

  async hardDeleteAll(): Promise<void> {
    await this.run(`DELETE FROM user_security`);
  }
}

export const userSecurityRepository = new UserSecurityRepository();
