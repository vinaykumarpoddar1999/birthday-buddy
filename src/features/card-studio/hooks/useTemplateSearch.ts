import { useMemo } from 'react';

import { useCardStudioStore } from '../store/card-studio.store';
import {
  getTrendingTemplates,
  searchCardTemplates,
} from '../utils/template-search';
import { useCardTemplates } from './useCardTemplates';

export function useTemplateSearch() {
  const searchQuery = useCardStudioStore((s) => s.searchQuery);
  const selectedCategory = useCardStudioStore((s) => s.selectedCategory);
  const filters = useCardStudioStore((s) => s.filters);
  const { data: allTemplates = [], isLoading } = useCardTemplates();

  const results = useMemo(
    () => searchCardTemplates(allTemplates, searchQuery, filters, selectedCategory),
    [allTemplates, searchQuery, selectedCategory, filters],
  );

  const trending = useMemo(() => getTrendingTemplates(allTemplates), [allTemplates]);

  return { results, trending, allTemplates, isLoading };
}
