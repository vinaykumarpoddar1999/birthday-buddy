import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { useAuthStore } from '@store/auth.store';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import { createContact, deleteContact, fetchContacts, updateContact } from '../api/contacts.api';
import type { CreateContactInput, UpdateContactInput } from '../types';

export function useContacts() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.contacts,
    queryFn: () => fetchContacts(userId!),
    enabled: Boolean(userId),
  });

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreateContactInput, 'user_id'>) =>
      createContact({ ...input, user_id: userId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
      analytics.track(ANALYTICS_EVENTS.BIRTHDAY_ADDED);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateContactInput) => updateContact(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts }),
  });

  return {
    contacts: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createContact: createMutation.mutateAsync,
    updateContact: updateMutation.mutateAsync,
    deleteContact: deleteMutation.mutateAsync,
  };
}
