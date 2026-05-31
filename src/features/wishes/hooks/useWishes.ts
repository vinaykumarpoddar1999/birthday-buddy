import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/react-query';
import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import { fetchWishes, generateAndSaveWish } from '../api/wishes.api';
import type { GenerateWishParams } from '../types';

export function useWishes(contactId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: contactId ? [...queryKeys.wishes, contactId] : queryKeys.wishes,
    queryFn: () => fetchWishes(contactId),
  });

  const generateMutation = useMutation({
    mutationFn: (params: GenerateWishParams) => generateAndSaveWish(params),
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
