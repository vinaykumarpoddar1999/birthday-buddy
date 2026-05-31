export type Referral = {
  id: string;
  referrer: string;
  referred: string;
  status: string;
  created_at: string;
};

export type ReferralCode = {
  id: string;
  user_id: string;
  code: string;
  created_at: string;
};

export type ReferralReward = {
  id: string;
  user_id: string;
  reward_type: string;
  created_at: string;
};
