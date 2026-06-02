import { useMemo } from 'react';

import { useCardStudioStore } from '../store/card-studio.store';
import { searchCardTemplates } from '../utils/template-search';
import { useCardTemplates } from './useCardTemplates';

export function useTemplateSearch() {
  const searchQuery = useCardStudioStore((s) => s.searchQuery);
  const selectedCategory = useCardStudioStore((s) => s.selectedCategory);
  const { data: allTemplates = [], isLoading } = useCardTemplates();

  const results = useMemo(
    () => searchCardTemplates(allTemplates, searchQuery, selectedCategory),
    [allTemplates, searchQuery, selectedCategory],
  );

  return { results, allTemplates, isLoading };
}
