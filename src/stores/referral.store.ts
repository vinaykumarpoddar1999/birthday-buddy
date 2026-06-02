import { create } from 'zustand';

import type { ReferralRecord } from '@features/premium/types';
import { referralService } from '@/services/premium/referral.service';

interface ReferralStoreState {
  code: string | null;
  inviteLink: string | null;
  referrals: ReferralRecord[];
  joinedCount: number;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  simulateJoin: () => Promise<string | null>;
}

export const useReferralStore = create<ReferralStoreState>()((set, get) => ({
  code: null,
  inviteLink: null,
  referrals: [],
  joinedCount: 0,
  hydrated: false,

  hydrate: async () => {
    const [code, inviteLink, referrals, joinedCount] = await Promise.all([
      referralService.getReferralCode(),
      referralService.getInviteLink(),
      referralService.listReferrals(),
      referralService.getJoinedCount(),
    ]);
    set({ code, inviteLink, referrals, joinedCount, hydrated: true });
  },

  simulateJoin: async () => {
    const { joinedCount, rewardMessage } = await referralService.simulateFriendJoined();
    const referrals = await referralService.listReferrals();
    const code = get().code ?? (await referralService.getReferralCode());
    set({ joinedCount, referrals, code });
    return rewardMessage;
  },
}));
