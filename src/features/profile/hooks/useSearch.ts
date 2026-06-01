import { useQuery } from '@tanstack/react-query';

import { searchService } from '@/services/search/search.service';

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchService.search(query),
    enabled: query.trim().length >= 1,
  });
}
