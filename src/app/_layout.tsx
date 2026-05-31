import '../global.css';

import { Stack } from 'expo-router';

import { AppProviders } from '@shared/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-person" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="card-studio" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AppProviders>
  );
}
