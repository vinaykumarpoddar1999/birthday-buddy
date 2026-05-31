import { useMutation } from '@tanstack/react-query';

import { fetchGiftSuggestions } from '../api/gifts.api';
import type { SuggestGiftsParams } from '../types';

export function useGifts() {
  const suggestMutation = useMutation({
    mutationFn: (params: SuggestGiftsParams) => fetchGiftSuggestions(params),
  });

  return {
    suggestions: suggestMutation.data,
    suggestGifts: suggestMutation.mutateAsync,
    isLoading: suggestMutation.isPending,
  };
}
