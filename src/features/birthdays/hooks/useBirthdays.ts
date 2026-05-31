import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import { createBirthday, deleteBirthday, fetchBirthdays } from '../api/birthdays.api';
import type { CreateBirthdayInput } from '../types';

export function useBirthdays() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.birthdays,
    queryFn: fetchBirthdays,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateBirthdayInput) => createBirthday(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.birthdays });
      analytics.track(ANALYTICS_EVENTS.BIRTHDAY_ADDED);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBirthday,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.birthdays }),
  });

  return {
    birthdays: query.data ?? [],
    isLoading: query.isLoading,
    createBirthday: createMutation.mutateAsync,
    deleteBirthday: deleteMutation.mutateAsync,
  };
}
