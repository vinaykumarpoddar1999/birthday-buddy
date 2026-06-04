import { QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { type ReactNode, useEffect, useState } from 'react';
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
import { EngagementPromptHost } from '@/shared/ui/engagement/EngagementPromptHost';
import { BirthdayAlarmHost } from '@/shared/ui/BirthdayAlarmHost';
import { EngagementRouteTracker } from '@/shared/providers/EngagementRouteTracker';
import { registerNotifeeAlarmListeners } from '@/services/notifications/notifee-alarm.service';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [boundaryKey, setBoundaryKey] = useState(0);

  useEffect(() => {
    if (Constants.appOwnership !== 'expo') {
      registerNotifeeAlarmListeners();
    }
  }, []);

  return (
    <AppErrorBoundary onReset={() => setBoundaryKey((value) => value + 1)}>
      <GestureHandlerRootView style={{ flex: 1 }} key={boundaryKey}>
        <DatabaseProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <FontScaleProvider>
                <StartupGate>
                  <AuthGate>
                    <AppLockProvider>
                      <EngagementRouteTracker />
                      {children}
                    </AppLockProvider>
                  </AuthGate>
                </StartupGate>
                <FeedbackHost />
                <EngagementPromptHost />
                <BirthdayAlarmHost />
              </FontScaleProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </DatabaseProvider>
      </GestureHandlerRootView>
    </AppErrorBoundary>
  );
}
