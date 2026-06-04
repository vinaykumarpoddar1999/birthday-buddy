import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { View } from 'react-native';

import { ensureAppBootstrap, isAppBootstrapComplete, resetAppBootstrap } from './app-bootstrap';
import { DatabaseManager } from './database-manager';
import { ErrorState, Loader } from '@/shared/ui';
import { DEFAULT_STARTUP_MESSAGE } from '@/shared/ui/loaders/startup-messages';

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
  const [isReady, setIsReady] = useState(isAppBootstrapComplete());
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const runBootstrap = useCallback(async (signal: { cancelled: boolean }) => {
    try {
      await ensureAppBootstrap();
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
    if (isAppBootstrapComplete()) {
      setIsReady(true);
      return;
    }

    const signal = { cancelled: false };
    void runBootstrap(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [attempt, runBootstrap]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsReady(false);
    resetAppBootstrap();
    void DatabaseManager.close().finally(() => setAttempt((value) => value + 1));
  }, []);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ErrorState kind="database" message={error} onRetry={handleRetry} />
      </View>
    );
  }

  if (!isReady) {
    return <Loader fullScreen message={DEFAULT_STARTUP_MESSAGE} variant="startup" />;
  }

  return (
    <DatabaseContext.Provider value={{ isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}
