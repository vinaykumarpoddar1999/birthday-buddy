import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { DatabaseManager } from './database-manager';
import { hydrateAppStores } from './store-hydration';
import { ErrorState } from '@/shared/ui';

type DatabaseContextValue = {
  isReady: boolean;
  error: string | null;
};

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: false,
  error: null,
});

export function useDatabaseReady(): DatabaseContextValue {
  return useContext(DatabaseContext);
}

type DatabaseProviderProps = {
  children: ReactNode;
};

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const initializeDatabase = useCallback(async (signal: { cancelled: boolean }) => {
    setError(null);
    setIsReady(false);

    try {
      await DatabaseManager.initialize();
      await hydrateAppStores();
      if (!signal.cancelled) {
        setIsReady(true);
        setError(null);
      }
    } catch (err) {
      if (!signal.cancelled) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
        setIsReady(false);
      }
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    void initializeDatabase(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [attempt, initializeDatabase]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ErrorState
          kind="database"
          message={error}
          onRetry={() => {
            void DatabaseManager.close().finally(() => setAttempt((value) => value + 1));
          }}
        />
      </View>
    );
  }

  if (!isReady) {
    return null;
  }

  return (
    <DatabaseContext.Provider value={{ isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}
