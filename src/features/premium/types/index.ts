export type SubscriptionPlanRecord = {
  id: string;
  planKey: string;
  name: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'yearly' | 'lifetime';
  savings?: string;
  benefits: string[];
  isPopular: boolean;
};

export type SubscriptionRecord = {
  id: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled';
  source: string;
  startedAt: string;
  expiresAt: string | null;
};

export type PremiumFeatureRecord = {
  id: string;
  featureKey: string;
  name: string;
  description: string;
  category: string;
};

export type ReferralRecord = {
  id: string;
  inviteeName?: string;
  inviteDate: string;
  joinedDate?: string;
  rewardEarned?: string;
  rewardStatus: 'pending' | 'joined' | 'rewarded';
  referralCode: string;
  inviteSource: string;
};

export type ReferralRewardTier = {
  milestone: number;
  rewardType: string;
  rewardValue: string;
  description: string;
};

export type RewardHistoryRecord = {
  id: string;
  rewardType: string;
  rewardValue: string;
  source: string;
  status: string;
  grantedAt: string;
};
