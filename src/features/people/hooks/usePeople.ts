import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { peopleService } from '@/services/people/people.service';
import { birthdayService } from '@/services/birthday/birthday.service';
import type { CreatePersonInput, Person, UpdatePersonInput } from '@/types/entities';

export const peopleQueryKeys = {
  all: ['people'] as const,
  list: () => [...peopleQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...peopleQueryKeys.all, 'detail', id] as const,
  upcoming: (limit?: number) => [...peopleQueryKeys.all, 'upcoming', limit] as const,
  stats: () => [...peopleQueryKeys.all, 'stats'] as const,
};

export function usePeople() {
  return useQuery({
    queryKey: peopleQueryKeys.list(),
    queryFn: () => peopleService.list(500, 0),
  });
}

export function usePerson(id: string | undefined) {
  return useQuery({
    queryKey: peopleQueryKeys.detail(id ?? ''),
    queryFn: () => (id ? peopleService.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useUpcomingPeople(limit?: number) {
  return useQuery({
    queryKey: peopleQueryKeys.upcoming(limit),
    queryFn: () => birthdayService.getUpcoming(limit),
  });
}

export function useBirthdayStats() {
  return useQuery({
    queryKey: peopleQueryKeys.stats(),
    queryFn: () => birthdayService.getStats(),
  });
}

export function usePersonMutations() {
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: ['calendar'] });
    queryClient.invalidateQueries({ queryKey: ['search'] });
  }, [queryClient]);

  const addPerson = useCallback(
    async (data: CreatePersonInput): Promise<string> => {
      const id = await peopleService.create(data);
      invalidate();
      return id;
    },
    [invalidate],
  );

  const updatePerson = useCallback(
    async (input: UpdatePersonInput): Promise<void> => {
      await peopleService.update(input);
      invalidate();
    },
    [invalidate],
  );

  const deletePerson = useCallback(
    async (id: string): Promise<void> => {
      await peopleService.delete(id);
      invalidate();
    },
    [invalidate],
  );

  const getPersonById = useCallback(
    (id: string): Person | undefined => {
      const data = queryClient.getQueryData<Person[]>(peopleQueryKeys.list());
      return data?.find((p) => p.id === id);
    },
    [queryClient],
  );

  return { addPerson, updatePerson, deletePerson, getPersonById, invalidate };
}
