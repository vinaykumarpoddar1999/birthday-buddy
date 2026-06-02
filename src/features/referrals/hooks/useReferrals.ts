import { useQuery } from '@tanstack/react-query';

import { useReferralStore } from '@/stores/referral.store';

export function useReferrals() {
  const code = useReferralStore((s) => s.code);
  const referrals = useReferralStore((s) => s.referrals);
  const joinedCount = useReferralStore((s) => s.joinedCount);
  const hydrate = useReferralStore((s) => s.hydrate);

  const { isLoading } = useQuery({
    queryKey: ['referrals', 'hydrate'],
    queryFn: async () => {
      await hydrate();
      return true;
    },
    staleTime: 60_000,
  });

  return {
    code,
    referrals,
    joinedCount,
    isLoading,
  };
}
