import '../global.css';

import { Stack } from 'expo-router';

import '@/services/backup/backup-scheduler.service';
import '@/services/notifications/notification-scheduler.service';
import { AppProviders } from '@shared/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-person" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="person-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="card-studio" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="surprise-link-studio" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="surprise-experience/[slug]" options={{ animation: 'fade' }} />
        <Stack.Screen name="surprise-analytics" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="surprise-history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ai-wish" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="personal-info" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="privacy-security" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="security-center" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="backup-restore" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="export-data" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="delete-account" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notification-prefs" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reminder-time" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="quiet-hours" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notification-detail" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="search" options={{ animation: 'fade' }} />
        <Stack.Screen name="language-select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="currency-select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="theme-select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="app-icon-select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="help-faq" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="send-feedback" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="rate-us" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="privacy-policy" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="terms-conditions" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="help-center" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="open-source-licenses" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="activity-history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="wish-history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="card-history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="import-data" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="contact-import" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="calendar-sync" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="appearance-settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reminder-settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="coming-soon" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AppProviders>
  );
}
