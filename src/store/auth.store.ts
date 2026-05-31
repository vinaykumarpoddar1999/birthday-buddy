import { create } from 'zustand';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setHydrated: (value: boolean) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  signOut: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
