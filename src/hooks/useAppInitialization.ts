import { useEffect } from 'react';

import { useDatabaseReady } from '@/database/database-provider';

/** Offline v1: app init only waits for SQLite. No auth hydration. */
export function useAppInitialization() {
  const { isReady } = useDatabaseReady();

  useEffect(() => {
    // DatabaseProvider handles initialization; hook reserved for future setup.
  }, [isReady]);

  return { isReady };
}
