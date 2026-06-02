import type { CardTemplate, TemplateCategoryFilter } from '../types';

function fuzzyMatch(haystack: string, needle: string): boolean {
  if (haystack.includes(needle)) return true;
  const words = needle.split(/\s+/);
  return words.every((w) => haystack.includes(w));
}

export function searchCardTemplates(
  templates: CardTemplate[],
  query: string,
  selectedCategory?: string,
): CardTemplate[] {
  let results = [...templates];

  if (selectedCategory && selectedCategory !== 'all') {
    results = results.filter(
      (t) => t.category === selectedCategory || t.tags.includes(selectedCategory),
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
