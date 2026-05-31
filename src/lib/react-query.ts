import { QueryClient } from '@tanstack/react-query';

export const queryKeys = {
  auth: ['auth'] as const,
  profile: (userId: string) => ['auth', 'profile', userId] as const,
  birthdays: ['birthdays'] as const,
  birthday: (id: string) => ['birthdays', id] as const,
  contacts: ['contacts'] as const,
  contact: (id: string) => ['contacts', id] as const,
  wishes: ['wishes'] as const,
  wish: (id: string) => ['wishes', id] as const,
  reminders: ['reminders'] as const,
  cards: ['cards'] as const,
  gifts: ['gifts'] as const,
  memories: ['memories'] as const,
  referrals: ['referrals'] as const,
  premium: ['premium'] as const,
  subscription: (userId: string) => ['premium', 'subscription', userId] as const,
  deviceTokens: ['device-tokens'] as const,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});
