import { useQuery } from '@tanstack/react-query';

import { cardService } from '@/services/card/card.service';
import { templateRegistry } from '../templates';

export const cardTemplatesQueryKey = ['card-templates'] as const;

export function useCardTemplates() {
  return useQuery({
    queryKey: cardTemplatesQueryKey,
    queryFn: async () => {
      const fromDb = await cardService.listStudioTemplates();
      if (fromDb.length > 0) return fromDb;
      return templateRegistry.getAllTemplates();
    },
    staleTime: 60_000,
  });
}
