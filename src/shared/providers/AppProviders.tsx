import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DatabaseProvider } from '@/database/database-provider';
import { queryClient } from '@/lib/react-query';
import { AppErrorBoundary } from '@/shared/providers/AppErrorBoundary';
import { AppLockProvider } from '@/shared/providers/AppLockProvider';
import { AuthGate } from '@/shared/providers/AuthGate';
import { FontScaleProvider } from '@/shared/providers/FontScaleProvider';
import { StartupGate } from '@/shared/providers/StartupGate';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { FeedbackHost } from '@/shared/ui/feedback/FeedbackHost';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [boundaryKey, setBoundaryKey] = useState(0);

  return (
    <AppErrorBoundary onReset={() => setBoundaryKey((value) => value + 1)}>
      <GestureHandlerRootView style={{ flex: 1 }} key={boundaryKey}>
        <DatabaseProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <FontScaleProvider>
                <StartupGate>
                  <AuthGate>
                    <AppLockProvider>{children}</AppLockProvider>
                  </AuthGate>
                </StartupGate>
                <FeedbackHost />
              </FontScaleProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </DatabaseProvider>
      </GestureHandlerRootView>
    </AppErrorBoundary>
  );
}
