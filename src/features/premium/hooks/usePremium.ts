/** Offline v1: premium subscriptions not active locally. */
export function usePremium() {
  return {
    plans: [],
    subscription: null,
    isLoading: false,
    subscribe: async () => {},
  };
}
