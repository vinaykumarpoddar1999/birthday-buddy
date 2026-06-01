import type { CardTemplate, FilterState } from '../types';

function fuzzyMatch(haystack: string, needle: string): boolean {
  if (haystack.includes(needle)) return true;
  const words = needle.split(/\s+/);
  return words.every((w) => haystack.includes(w));
}

export function searchCardTemplates(
  templates: CardTemplate[],
  query: string,
  filters?: FilterState,
  selectedCategory?: string,
): CardTemplate[] {
  let results = [...templates];

  if (selectedCategory && selectedCategory !== 'all') {
    if (selectedCategory === 'trending') {
      results = results.filter((t) => t.isTrending);
    } else {
      results = results.filter(
        (t) => t.category === selectedCategory || t.tags.includes(selectedCategory),
      );
    }
  }

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter((t) => {
      const haystack = [t.name, t.category, ...t.tags].join(' ').toLowerCase();
      return fuzzyMatch(haystack, q);
    });
  }

  if (filters) {
    if (filters.occasion.length > 0) {
      results = results.filter((t) =>
        filters.occasion.some((occ) => t.category === occ || t.tags.includes(occ)),
      );
    }
    if (filters.style.length > 0) {
      results = results.filter((t) =>
        filters.style.some((s) => t.category === s || t.tags.includes(s)),
      );
    }
    if (filters.isPremiumOnly) {
      results = results.filter((t) => t.isPremium);
    }
    if (filters.isFreeOnly) {
      results = results.filter((t) => !t.isPremium);
    }
  }

  return results;
}

export function getTrendingTemplates(templates: CardTemplate[]): CardTemplate[] {
  return templates.filter((t) => t.isTrending);
}
