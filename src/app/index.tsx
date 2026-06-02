import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuthStore } from '@/stores/auth.store';

export default function Index() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const authState = useAuthStore((s) => s.authState);

  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  switch (authState) {
    case 'setup_required':
      return <Redirect href="/(auth)/onboarding" />;
    case 'unauthenticated':
      return <Redirect href="/(auth)/welcome" />;
    case 'session_recovery':
      return <Redirect href="/(auth)/session-recovery" />;
    case 'locked':
      return <Redirect href="/(auth)/lock" />;
    case 'guest':
    case 'authenticated':
    default:
      return <Redirect href="/(tabs)" />;
  }
}
