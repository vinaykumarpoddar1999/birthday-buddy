import { create } from 'zustand';

/** Offline v1: no real auth — store exists for API compatibility only. */
export type AuthUser = {
  id: string;
  email: string;
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
  isAuthenticated: true,
  isHydrated: true,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  signOut: () => set({ user: null, isAuthenticated: true }),
}));
