import { useEffect, useState } from 'react';

const DEFAULT_DELAY_MS = 300;

export function useDebouncedSearch(query: string, delayMs = DEFAULT_DELAY_MS): string {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === '') {
      setDebouncedQuery('');
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(trimmed);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [query, delayMs]);

  return debouncedQuery;
}
