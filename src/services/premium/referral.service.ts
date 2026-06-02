import type { ReferralRecord } from '@features/premium/types';
import { referralRepository } from '@/repositories/referral.repository';
import { rewardEngineService } from './reward-engine.service';

const INVITE_BASE_URL = 'https://birthdaybuddy.app/invite';

export class ReferralService {
  async getReferralCode(): Promise<string> {
    return referralRepository.getOrCreateReferralCode();
  }

  async getInviteLink(): Promise<string> {
    const code = await this.getReferralCode();
    return `${INVITE_BASE_URL}/${code}`;
  }

  async listReferrals(): Promise<ReferralRecord[]> {
    return referralRepository.listReferrals();
  }

  async getJoinedCount(): Promise<number> {
    return referralRepository.countJoined();
  }

  async simulateFriendJoined(): Promise<{ joinedCount: number; rewardMessage: string | null }> {
    const code = await this.getReferralCode();
    await referralRepository.markPendingAsJoined(code);
    const joinedCount = await referralRepository.countJoined();
    const rewardMessage = await rewardEngineService.processReferralMilestone(joinedCount);
    return { joinedCount, rewardMessage };
  }

  getShareMessage(code: string): string {
    return `Never forget a birthday again 🎉

Join BirthdayBuddy using my invite code and both of us get Premium rewards.

Download now:
${INVITE_BASE_URL}/${code}`;
  }
}

export const referralService = new ReferralService();
