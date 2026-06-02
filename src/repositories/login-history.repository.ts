import { BaseRepository } from './base-repository';
import type { AuthMethod, LoginHistoryEntry } from '@features/auth/types/auth.types';

interface LoginHistoryRow {
  uuid: string;
  user_uuid: string;
  session_uuid: string | null;
  login_at: string;
  logout_at: string | null;
  device_id: string;
  device_name: string;
  auth_method: string;
  success: number;
  failure_reason: string | null;
}

export class LoginHistoryRepository extends BaseRepository {
  private mapRow(row: LoginHistoryRow): LoginHistoryEntry {
    return {
      id: row.uuid,
      userId: row.user_uuid,
      loginAt: row.login_at,
      logoutAt: row.logout_at,
      deviceId: row.device_id,
      deviceName: row.device_name,
      authMethod: row.auth_method as AuthMethod,
      success: row.success === 1,
      failureReason: row.failure_reason,
    };
  }

  async record(input: {
    userUuid: string;
    sessionUuid?: string;
    deviceName: string;
    authMethod: AuthMethod;
    success: boolean;
    failureReason?: string;
  }): Promise<void> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO login_history (
        uuid, created_at, updated_at, device_id, sync_status,
        user_uuid, session_uuid, login_at, device_name,
        auth_method, success, failure_reason
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        input.userUuid,
        input.sessionUuid ?? null,
        now,
        input.deviceName,
        input.authMethod,
        input.success ? 1 : 0,
        input.failureReason ?? null,
      ],
    );
  }

  async recordLogout(userUuid: string, sessionUuid?: string): Promise<void> {
    const now = this.now();
    if (sessionUuid) {
      await this.run(
        `UPDATE login_history SET logout_at = ?, updated_at = ? WHERE session_uuid = ? AND logout_at IS NULL`,
        [now, now, sessionUuid],
      );
    } else {
      await this.run(
        `UPDATE login_history SET logout_at = ?, updated_at = ? WHERE user_uuid = ? AND logout_at IS NULL ORDER BY login_at DESC LIMIT 1`,
        [now, now, userUuid],
      );
    }
  }

  async getRecent(userUuid: string, limit = 20): Promise<LoginHistoryEntry[]> {
    const rows = await this.getAll<LoginHistoryRow>(
      `SELECT * FROM login_history WHERE user_uuid = ? AND ${this.notDeletedClause()} ORDER BY login_at DESC LIMIT ?`,
      [userUuid, limit],
    );
    return rows.map((r) => this.mapRow(r));
  }

  async getFailedAttemptsSince(userUuid: string, sinceIso: string): Promise<number> {
    const row = await this.getFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM login_history WHERE user_uuid = ? AND success = 0 AND login_at >= ?`,
      [userUuid, sinceIso],
    );
    return row?.count ?? 0;
  }

  async hardDeleteAll(): Promise<void> {
    await this.run(`DELETE FROM login_history`);
  }
}

export const loginHistoryRepository = new LoginHistoryRepository();
