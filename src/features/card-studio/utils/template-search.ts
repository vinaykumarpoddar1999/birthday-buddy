import type { CardTemplate, TemplateCategory, TemplateCategoryFilter } from '../types';

function fuzzyMatch(haystack: string, needle: string): boolean {
  if (haystack.includes(needle)) return true;
  const words = needle.split(/\s+/);
  return words.every((w) => haystack.includes(w));
}

const OTHER_CATEGORIES: TemplateCategory[] = [
  'professional',
  'thank-you',
  'festival',
  'modern',
  'family',
  'minimal',
];

function matchesCategoryFilter(template: CardTemplate, filter: TemplateCategoryFilter): boolean {
  if (filter === 'love') {
    return template.category === 'romantic' || template.tags.includes('romantic') || template.tags.includes('love');
  }
  if (filter === 'friendship') {
    return template.category === 'friend' || template.tags.includes('friend');
  }
  if (filter === 'other') {
    return (
      OTHER_CATEGORIES.includes(template.category) ||
      template.tags.some((tag) => OTHER_CATEGORIES.includes(tag as TemplateCategory))
    );
  }
  return template.category === filter || template.tags.includes(filter);
}

export function searchCardTemplates(
  templates: CardTemplate[],
  query: string,
  selectedCategory?: string,
): CardTemplate[] {
  let results = [...templates];

  if (selectedCategory) {
    results = results.filter((t) =>
      matchesCategoryFilter(t, selectedCategory as TemplateCategoryFilter),
    );
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter((t) => {
      const haystack = [t.name, t.category, ...t.tags].join(' ').toLowerCase();
      return fuzzyMatch(haystack, q);
    });
  }

  return results;
}
