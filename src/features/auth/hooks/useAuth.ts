/** Offline v1: auth UI disabled — stubs prevent crashes if screens are opened. */
export function useAuth() {
  return {
    user: null,
    isAuthenticated: true,
    isHydrated: true,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    isSigningIn: false,
    isSigningUp: false,
  };
}
