import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@store/auth.store';
import { getProfile, signInWithEmail, signOut, signUpWithEmail } from '../api/auth.api';
import type { SignInInput, SignUpInput } from '../types';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: user ? queryKeys.profile(user.id) : ['auth', 'profile', 'none'],
    queryFn: () => (user ? getProfile(user.id) : null),
    enabled: Boolean(user),
  });

  const signInMutation = useMutation({
    mutationFn: (input: SignInInput) => signInWithEmail(input),
    onSuccess: (data) => {
      const authUser = data.user;
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email ?? '',
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (input: SignUpInput) => signUpWithEmail(input),
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      useAuthStore.getState().signOut();
      queryClient.clear();
    },
  });

  return {
    user,
    profile: profileQuery.data,
    isAuthenticated,
    isHydrated,
    isLoadingProfile: profileQuery.isLoading,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
  };
}
