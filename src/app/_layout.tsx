import '../global.css';
import 'react-native-reanimated';

import '@/services/background-tasks';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { AppProviders } from '@shared/providers/AppProviders';

function registerGlobalErrorHandlers(): void {
  const errorUtils = (globalThis as { ErrorUtils?: { setGlobalHandler?: (handler: (error: Error, isFatal?: boolean) => void) => void } }).ErrorUtils;
  errorUtils?.setGlobalHandler?.((error, isFatal) => {
    if (__DEV__) {
      console.error('[global]', isFatal ? 'fatal' : 'non-fatal', error);
    }
  });
}

export default function RootLayout() {
  useEffect(() => {
    registerGlobalErrorHandlers();
  }, []);

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-person" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="person-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="card-studio" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ai-wish" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="personal-info" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="privacy-security" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="backup-restore" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="export-data" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reminder-settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reminder-time" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notification-settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notification-detail" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="search" options={{ animation: 'fade' }} />
        <Stack.Screen name="help-faq" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="send-feedback" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="rate-us" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="privacy-policy" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="terms-conditions" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="help-center" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="open-source-licenses" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="import-data" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="contact-picker" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="contact-details-queue" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="coming-soon" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AppProviders>
  );
}
