import { useMutation } from '@tanstack/react-query';

import { shareContent, type ShareContentInput } from '../api/sharing.api';

export function useSharing() {
  const shareMutation = useMutation({
    mutationFn: (input: ShareContentInput) => shareContent(input),
  });

  return {
    share: shareMutation.mutateAsync,
    isSharing: shareMutation.isPending,
  };
}
