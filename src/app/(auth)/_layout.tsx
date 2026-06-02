import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="pin-setup" />
      <Stack.Screen name="lock" />
      <Stack.Screen name="biometric-setup" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="security-preferences" />
      <Stack.Screen name="session-recovery" />
    </Stack>
  );
}
