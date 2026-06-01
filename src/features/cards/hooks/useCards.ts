import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import { cardService } from '@/services/card/card.service';

export function useCards(personUuid?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: personUuid ? [...queryKeys.cards, personUuid] : queryKeys.cards,
    queryFn: () => (personUuid ? cardService.listByPerson(personUuid) : Promise.resolve([])),
    enabled: Boolean(personUuid),
  });

  const createMutation = useMutation({
    mutationFn: (params: {
      personUuid?: string;
      templateUuid?: string;
      cardJson: string;
    }) =>
      cardService.saveCard(
        params.personUuid,
        params.templateUuid,
        params.cardJson,
      ),
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
