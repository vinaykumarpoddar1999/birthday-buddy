import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { usePeople, usePersonMutations } from '@features/people/hooks/usePeople';
import type { CreateContactInput, UpdateContactInput, Contact } from '../types';
import type { CreatePersonInput } from '@/types/entities';

function toContactFromPerson(p: {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  relationship: string;
  birthDate: string;
  notes?: string;
  createdAt: string;
}): Contact {
  return {
    id: p.id,
    name: p.fullName,
    phone: p.phone ?? null,
    email: p.email ?? null,
    relationship: p.relationship,
    dob: p.birthDate,
    notes: p.notes ?? null,
    user_id: 'local',
    created_at: p.createdAt,
  };
}

export function useContacts() {
  const { data: people = [], isLoading, error } = usePeople();
  const { addPerson, updatePerson, deletePerson } = usePersonMutations();
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts });

  const createMutation = useMutation({
    mutationFn: async (input: Omit<CreateContactInput, 'user_id'>) => {
      const payload: CreatePersonInput = {
        fullName: input.name,
        birthDate: input.dob ?? '2000-01-01',
        gender: 'other',
        relationship: 'friend',
        phone: input.phone ?? undefined,
        email: input.email ?? undefined,
        notes: input.notes ?? undefined,
      };
      return addPerson(payload);
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async (input: UpdateContactInput) => {
      await updatePerson({
        id: input.id,
        fullName: input.name,
        phone: input.phone ?? undefined,
        email: input.email ?? undefined,
        notes: input.notes ?? undefined,
        birthDate: input.dob ?? undefined,
      });
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePerson,
    onSuccess: invalidate,
  });

  return {
    contacts: people.map(toContactFromPerson),
    isLoading,
    error,
    createContact: createMutation.mutateAsync,
    updateContact: updateMutation.mutateAsync,
    deleteContact: deleteMutation.mutateAsync,
  };
}
