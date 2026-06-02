import { BaseRepository } from './base-repository';
import type { AuthMethod, AuthSession } from '@features/auth/types/auth.types';

interface SessionRow {
  uuid: string;
  user_uuid: string;
  session_token_hash: string;
  device_id: string;
  device_name: string;
  platform: string;
  auth_method: string;
  is_active: number;
  expires_at: string | null;
  last_validated_at: string;
  last_activity_at: string;
  refresh_count: number;
}

export class SessionRepository extends BaseRepository {
  private mapRow(row: SessionRow): AuthSession {
    return {
      id: row.uuid,
      userId: row.user_uuid,
      deviceId: row.device_id,
      authMethod: row.auth_method as AuthMethod,
      isActive: row.is_active === 1,
      lastValidatedAt: row.last_validated_at,
      lastActivityAt: row.last_activity_at,
      expiresAt: row.expires_at,
    };
  }

  async create(input: {
    userUuid: string;
    tokenHash: string;
    deviceName: string;
    platform: string;
    authMethod: AuthMethod;
  }): Promise<AuthSession> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO user_sessions (
        uuid, created_at, updated_at, device_id, sync_status,
        user_uuid, session_token_hash, device_name, platform,
        auth_method, is_active, last_validated_at, last_activity_at
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        input.userUuid,
        input.tokenHash,
        input.deviceName,
        input.platform,
        input.authMethod,
        now,
        now,
      ],
    );
    const session = await this.findByUuid(uuid);
    if (!session) throw new Error('Failed to create session');
    return session;
  }

  async findByUuid(uuid: string): Promise<AuthSession | null> {
    const row = await this.getFirst<SessionRow>(
      `SELECT * FROM user_sessions WHERE uuid = ? AND ${this.notDeletedClause()}`,
      [uuid],
    );
    return row ? this.mapRow(row) : null;
  }

  async findByTokenHash(tokenHash: string): Promise<AuthSession | null> {
    const row = await this.getFirst<SessionRow>(
      `SELECT * FROM user_sessions WHERE session_token_hash = ? AND is_active = 1 AND ${this.notDeletedClause()}`,
      [tokenHash],
    );
    return row ? this.mapRow(row) : null;
  }

  async findActiveByUser(userUuid: string): Promise<AuthSession[]> {
    const rows = await this.getAll<SessionRow>(
      `SELECT * FROM user_sessions WHERE user_uuid = ? AND is_active = 1 AND ${this.notDeletedClause()} ORDER BY last_activity_at DESC`,
      [userUuid],
    );
    return rows.map((r) => this.mapRow(r));
  }

  async updateActivity(sessionUuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE user_sessions SET last_activity_at = ?, last_validated_at = ?, updated_at = ?, refresh_count = refresh_count + 1 WHERE uuid = ?`,
      [now, now, now, sessionUuid],
    );
  }

  async invalidate(sessionUuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE user_sessions SET is_active = 0, updated_at = ? WHERE uuid = ?`,
      [now, sessionUuid],
    );
  }

  async invalidateAllForUser(userUuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE user_sessions SET is_active = 0, updated_at = ? WHERE user_uuid = ? AND is_active = 1`,
      [now, userUuid],
    );
  }

  async hardDeleteAll(): Promise<void> {
    await this.run(`DELETE FROM user_sessions`);
  }
}

export const sessionRepository = new SessionRepository();
