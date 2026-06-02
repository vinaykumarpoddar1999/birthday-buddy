import { BaseRepository } from './base-repository';
import type { AccountStatus, AuthUser } from '@features/auth/types/auth.types';

interface UserRow {
  uuid: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  nickname: string;
  profile_photo: string | null;
  date_of_birth: string;
  gender: string;
  country: string;
  timezone: string;
  preferred_language: string;
  account_status: string;
  last_login_at: string | null;
  terms_accepted_at: string | null;
  privacy_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: number;
}

export type CreateUserInput = {
  email?: string | null;
  phone?: string | null;
  fullName: string;
  nickname: string;
  profilePhoto?: string | null;
  dateOfBirth: string;
  gender: string;
  country: string;
  timezone: string;
  preferredLanguage: string;
  termsAcceptedAt: string;
  privacyAcceptedAt: string;
};

export class UserRepository extends BaseRepository {
  private mapRow(row: UserRow): AuthUser {
    return {
      id: row.uuid,
      email: row.email,
      phone: row.phone,
      fullName: row.full_name,
      nickname: row.nickname,
      profilePhoto: row.profile_photo,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      country: row.country,
      timezone: row.timezone,
      preferredLanguage: row.preferred_language,
      accountStatus: row.account_status as AccountStatus,
      lastLoginAt: row.last_login_at,
    };
  }

  async create(input: CreateUserInput): Promise<AuthUser> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO users (
        uuid, created_at, updated_at, device_id, sync_status,
        email, phone, full_name, nickname, profile_photo,
        date_of_birth, gender, country, timezone, preferred_language,
        terms_accepted_at, privacy_accepted_at, account_status
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        uuid,
        now,
        now,
        this.deviceId,
        input.email ?? null,
        input.phone ?? null,
        input.fullName,
        input.nickname,
        input.profilePhoto ?? null,
        input.dateOfBirth,
        input.gender,
        input.country,
        input.timezone,
        input.preferredLanguage,
        input.termsAcceptedAt,
        input.privacyAcceptedAt,
      ],
    );
    const user = await this.findByUuid(uuid);
    if (!user) throw new Error('Failed to create user');
    return user;
  }

  async findByUuid(uuid: string): Promise<AuthUser | null> {
    const row = await this.getFirst<UserRow>(
      `SELECT * FROM users WHERE uuid = ? AND ${this.notDeletedClause()}`,
      [uuid],
    );
    return row ? this.mapRow(row) : null;
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const row = await this.getFirst<UserRow>(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND ${this.notDeletedClause()}`,
      [email.trim()],
    );
    return row ? this.mapRow(row) : null;
  }

  async findByPhone(phone: string): Promise<AuthUser | null> {
    const normalized = phone.replace(/\D/g, '');
    const row = await this.getFirst<UserRow>(
      `SELECT * FROM users WHERE REPLACE(REPLACE(REPLACE(phone, '-', ''), ' ', ''), '+', '') = ? AND ${this.notDeletedClause()}`,
      [normalized],
    );
    return row ? this.mapRow(row) : null;
  }

  async hasAnyUser(): Promise<boolean> {
    const row = await this.getFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM users WHERE ${this.notDeletedClause()}`,
    );
    return (row?.count ?? 0) > 0;
  }

  async getActiveUser(): Promise<AuthUser | null> {
    const row = await this.getFirst<UserRow>(
      `SELECT * FROM users WHERE ${this.notDeletedClause()} AND account_status = 'active' ORDER BY created_at ASC LIMIT 1`,
    );
    return row ? this.mapRow(row) : null;
  }

  async updateLastLogin(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(`UPDATE users SET last_login_at = ?, updated_at = ? WHERE uuid = ?`, [
      now,
      now,
      uuid,
    ]);
  }

  async updateProfile(uuid: string, updates: Partial<CreateUserInput>): Promise<void> {
    const now = this.now();
    const fields: string[] = ['updated_at = ?'];
    const params: (string | null)[] = [now];

    if (updates.fullName !== undefined) {
      fields.push('full_name = ?');
      params.push(updates.fullName);
    }
    if (updates.nickname !== undefined) {
      fields.push('nickname = ?');
      params.push(updates.nickname);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      params.push(updates.email ?? null);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      params.push(updates.phone ?? null);
    }
    if (updates.profilePhoto !== undefined) {
      fields.push('profile_photo = ?');
      params.push(updates.profilePhoto ?? null);
    }

    params.push(uuid);
    await this.run(`UPDATE users SET ${fields.join(', ')} WHERE uuid = ?`, params);
  }

  async softDelete(uuid: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE users SET is_deleted = 1, deleted_at = ?, account_status = 'deleted', updated_at = ? WHERE uuid = ?`,
      [now, now, uuid],
    );
  }

  async hardDeleteAll(): Promise<void> {
    await this.run(`DELETE FROM users`);
  }
}

export const userRepository = new UserRepository();
