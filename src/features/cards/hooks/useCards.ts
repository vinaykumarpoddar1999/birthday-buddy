import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import { createCard, fetchCards } from '../api/cards.api';
import type { CreateCardParams } from '../types';

export function useCards() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.cards,
    queryFn: fetchCards,
  });

  const createMutation = useMutation({
    mutationFn: (params: CreateCardParams) => createCard(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards });
      analytics.track(ANALYTICS_EVENTS.CARD_SHARED);
    },
  });

  return {
    cards: query.data ?? [],
    isLoading: query.isLoading,
    createCard: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
