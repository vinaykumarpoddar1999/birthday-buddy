import { referralRepository } from '@/repositories/referral.repository';
import { subscriptionService } from './subscription.service';

export class RewardEngineService {
  async processReferralMilestone(joinedCount: number): Promise<string | null> {
    const tiers = await referralRepository.listRewardTiers();
    const tier = tiers.filter((t) => t.milestone <= joinedCount).sort((a, b) => b.milestone - a.milestone)[0];
    if (!tier) return null;

    if (tier.rewardType === 'premium_days') {
      const days = Number.parseInt(tier.rewardValue, 10);
      await subscriptionService.grantReferralPremium(days);
      await referralRepository.logReward(tier.rewardType, tier.rewardValue, 'referral');
      return tier.description;
    }

    if (tier.rewardType === 'premium_months') {
      const months = Number.parseInt(tier.rewardValue, 10);
      await subscriptionService.grantReferralPremium(months * 30);
      await referralRepository.logReward(tier.rewardType, tier.rewardValue, 'referral');
      return tier.description;
    }

    return null;
  }
}

export const rewardEngineService = new RewardEngineService();
