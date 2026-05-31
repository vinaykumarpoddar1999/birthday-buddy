import { useMemo } from 'react';

import { useCardStudioStore } from '../store/card-studio.store';
import { templateRegistry } from '../templates';

export function useTemplateSearch() {
  const searchQuery = useCardStudioStore((s) => s.searchQuery);
  const selectedCategory = useCardStudioStore((s) => s.selectedCategory);
  const filters = useCardStudioStore((s) => s.filters);

  const results = useMemo(
    () => templateRegistry.searchTemplates(searchQuery, filters, selectedCategory),
    [searchQuery, selectedCategory, filters],
  );

  const trending = useMemo(() => templateRegistry.getTrending(), []);

  const allTemplates = useMemo(() => templateRegistry.getAllTemplates(), []);

  return { results, trending, allTemplates };
}
