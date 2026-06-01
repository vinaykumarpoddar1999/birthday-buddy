import { useMutation } from '@tanstack/react-query';

import { suggestGift } from '@services/ai/ai.service';

export function useGifts() {
  const mutation = useMutation({
    mutationFn: () => suggestGift(),
  });

  return {
    suggestGifts: mutation.mutateAsync,
    suggestions: mutation.data?.suggestions ?? [],
    isLoading: mutation.isPending,
  };
}
