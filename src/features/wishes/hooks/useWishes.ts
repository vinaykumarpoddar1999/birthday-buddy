import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import { wishService } from '@/services/wish/wish.service';

export function useWishes(personUuid?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: personUuid ? [...queryKeys.wishes, personUuid] : queryKeys.wishes,
    queryFn: () => (personUuid ? wishService.listByPerson(personUuid) : Promise.resolve([])),
    enabled: Boolean(personUuid),
  });

  const generateMutation = useMutation({
    mutationFn: async (params: {
      personUuid: string;
      tone: Parameters<typeof wishService.generateAndSave>[1]['tone'];
      length: Parameters<typeof wishService.generateAndSave>[1]['length'];
      language: Parameters<typeof wishService.generateAndSave>[1]['language'];
      personalContext?: string;
      age?: number;
      relationship: string;
    }) =>
      wishService.generateAndSave(params.personUuid, {
        tone: params.tone,
        length: params.length,
        language: params.language,
        personalContext: params.personalContext,
        age: params.age,
        relationship: params.relationship,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishes });
      analytics.track(ANALYTICS_EVENTS.WISH_GENERATED);
    },
  });

  return {
    wishes: query.data ?? [],
    isLoading: query.isLoading,
    generateWish: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
  };
}
