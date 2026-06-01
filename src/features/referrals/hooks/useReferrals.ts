/** Offline v1: referrals not active locally. */
export function useReferrals() {
  return {
    code: null,
    referrals: [],
    rewards: [],
    isLoading: false,
  };
}
