import { BaseRepository } from './base-repository';
import type { ReferralRecord, ReferralRewardTier } from '@features/premium/types';

interface ReferralRow {
  uuid: string;
  invitee_name: string | null;
  invite_date: string;
  joined_date: string | null;
  reward_earned: string | null;
  reward_status: string;
  referral_code: string;
  invite_source: string;
}

interface CodeRow {
  uuid: string;
  code: string;
  owner_label: string;
}

export class ReferralRepository extends BaseRepository {
  async getOrCreateReferralCode(): Promise<string> {
    const existing = await this.getFirst<CodeRow>(
      `SELECT uuid, code, owner_label FROM referral_codes WHERE ${this.notDeletedClause()} LIMIT 1`,
    );
    if (existing) return existing.code;

    const code = this.generateReferralCode();
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO referral_codes (
        uuid, created_at, updated_at, is_deleted, version, sync_status, device_id, code, owner_label
      ) VALUES (?, ?, ?, 0, 1, 'local', ?, ?, 'You')`,
      [uuid, now, now, this.deviceId, code],
    );
    return code;
  }

  private generateReferralCode(): string {
    const words = ['BUDDY', 'LOVE', 'GIFT', 'CAKE', 'PARTY', 'JOY'];
    const word = words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${word}${num}`;
  }

  async listReferrals(): Promise<ReferralRecord[]> {
    const rows = await this.getAll<ReferralRow>(
      `SELECT uuid, invitee_name, invite_date, joined_date, reward_earned, reward_status, referral_code, invite_source
       FROM referrals WHERE ${this.notDeletedClause()} ORDER BY invite_date ASC`,
    );
    return rows.map((r) => ({
      id: r.uuid,
      inviteeName: r.invitee_name ?? undefined,
      inviteDate: r.invite_date,
      joinedDate: r.joined_date ?? undefined,
      rewardEarned: r.reward_earned ?? undefined,
      rewardStatus: r.reward_status as ReferralRecord['rewardStatus'],
      referralCode: r.referral_code,
      inviteSource: r.invite_source,
    }));
  }

  async countJoined(): Promise<number> {
    const row = await this.getFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM referrals WHERE reward_status IN ('joined', 'rewarded') AND ${this.notDeletedClause()}`,
    );
    return row?.count ?? 0;
  }

  async addReferral(inviteeName: string, code: string, source: string): Promise<string> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO referrals (
        uuid, created_at, updated_at, is_deleted, version, sync_status, device_id,
        invitee_name, invite_date, reward_status, referral_code, invite_source
      ) VALUES (?, ?, ?, 0, 1, 'local', ?, ?, ?, 'pending', ?, ?)`,
      [uuid, now, now, this.deviceId, inviteeName, now, code, source],
    );
    return uuid;
  }

  async markJoined(id: string, rewardEarned?: string): Promise<void> {
    const now = this.now();
    await this.run(
      `UPDATE referrals SET joined_date = ?, reward_status = 'joined', reward_earned = ?, updated_at = ? WHERE uuid = ?`,
      [now, rewardEarned ?? null, now, id],
    );
  }

  async markPendingAsJoined(code: string): Promise<ReferralRecord | null> {
    const pending = await this.getFirst<ReferralRow>(
      `SELECT uuid, invitee_name, invite_date, joined_date, reward_earned, reward_status, referral_code, invite_source
       FROM referrals WHERE reward_status = 'pending' AND ${this.notDeletedClause()} ORDER BY invite_date ASC LIMIT 1`,
    );
    if (!pending) {
      const names = ['Ali', 'Riya', 'Kabir', 'Sara', 'Dev'];
      const joined = await this.countJoined();
      const name = names[joined % names.length] ?? 'Friend';
      const id = await this.addReferral(name, code, 'simulated');
      await this.markJoined(id);
      return {
        id,
        inviteeName: name,
        inviteDate: this.now(),
        joinedDate: this.now(),
        rewardStatus: 'joined',
        referralCode: code,
        inviteSource: 'simulated',
      };
    }
    await this.markJoined(pending.uuid);
    return {
      id: pending.uuid,
      inviteeName: pending.invitee_name ?? undefined,
      inviteDate: pending.invite_date,
      joinedDate: this.now(),
      rewardStatus: 'joined',
      referralCode: pending.referral_code,
      inviteSource: pending.invite_source,
    };
  }

  async listRewardTiers(): Promise<ReferralRewardTier[]> {
    const rows = await this.getAll<{
      milestone: number;
      reward_type: string;
      reward_value: string;
      description: string;
    }>(
      `SELECT milestone, reward_type, reward_value, description FROM referral_rewards WHERE ${this.notDeletedClause()} ORDER BY milestone ASC`,
    );
    return rows.map((r) => ({
      milestone: r.milestone,
      rewardType: r.reward_type,
      rewardValue: r.reward_value,
      description: r.description,
    }));
  }

  async logReward(rewardType: string, rewardValue: string, source: string): Promise<void> {
    const uuid = this.newUuid();
    const now = this.now();
    await this.run(
      `INSERT INTO reward_history (
        uuid, created_at, updated_at, is_deleted, version, sync_status, device_id,
        reward_type, reward_value, source, status, granted_at
      ) VALUES (?, ?, ?, 0, 1, 'local', ?, ?, ?, ?, 'granted', ?)`,
      [uuid, now, now, this.deviceId, rewardType, rewardValue, source, now],
    );
  }
}

export const referralRepository = new ReferralRepository();
