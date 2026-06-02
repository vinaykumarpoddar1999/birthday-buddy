import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DatabaseProvider } from '@/database/database-provider';
import { queryClient } from '@/lib/react-query';
import { AppLockProvider } from '@/shared/providers/AppLockProvider';
import { AuthGate } from '@/shared/providers/AuthGate';
import { FontScaleProvider } from '@/shared/providers/FontScaleProvider';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { FeedbackHost } from '@/shared/ui/feedback/FeedbackHost';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <FontScaleProvider>
              <AuthGate>
                <AppLockProvider>{children}</AppLockProvider>
              </AuthGate>
              <FeedbackHost />
            </FontScaleProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}
