import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@store/auth.store';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import {
  createReferralCode,
  fetchReferralRewards,
  fetchReferrals,
  getReferralCode,
} from '../api/referrals.api';

export function useReferrals() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const referralsQuery = useQuery({
    queryKey: queryKeys.referrals,
    queryFn: () => fetchReferrals(userId!),
    enabled: Boolean(userId),
  });

  const codeQuery = useQuery({
    queryKey: [...queryKeys.referrals, 'code'],
    queryFn: () => getReferralCode(userId!),
    enabled: Boolean(userId),
  });

  const rewardsQuery = useQuery({
    queryKey: [...queryKeys.referrals, 'rewards'],
    queryFn: () => fetchReferralRewards(userId!),
    enabled: Boolean(userId),
  });

  const createCodeMutation = useMutation({
    mutationFn: (code: string) => createReferralCode(userId!, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.referrals });
      analytics.track(ANALYTICS_EVENTS.REFERRAL_SENT);
    },
  });

  return {
    referrals: referralsQuery.data ?? [],
    referralCode: codeQuery.data,
    rewards: rewardsQuery.data ?? [],
    createReferralCode: createCodeMutation.mutateAsync,
    isLoading: referralsQuery.isLoading,
  };
}
