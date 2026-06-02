import { router } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { sessionService } from '@/services/auth/session.service';
import { secureAuthStorage } from '@/services/auth/secure-auth-storage';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { useAuthStore } from '@/stores/auth.store';
import { AuthScreenLayout } from '../components';

export function SessionRecoveryScreen() {
  const { user } = useAuth();
  const hydrate = useAuthStore((s) => s.hydrate);
  const { showSuccess, showError } = useFeedback();

  const handleRecover = async () => {
    const resolvedUserId = user?.id ?? (await secureAuthStorage.getSessionUserId());

    if (!resolvedUserId) {
      showError('No Session', 'Please sign in to recover your session.');
      router.replace('/(auth)/login');
      return;
    }

    try {
      const session = await sessionService.recoverSession(resolvedUserId);
      if (session) {
        await hydrate();
        showSuccess('Session Restored', 'Your session has been recovered successfully.', () =>
          router.replace('/(tabs)'),
        );
      } else {
        showError('Recovery Failed', 'Could not restore session. Please sign in again.');
        router.replace('/(auth)/login');
      }
    } catch {
      showError('Recovery Failed', 'Please sign in with your credentials.');
      router.replace('/(auth)/login');
    }
  };

  const handleReLogin = async () => {
    router.replace('/(auth)/login');
  };

  return (
    <AuthScreenLayout title="Session Recovery" subtitle="Restore your secure session or sign in again." scrollable={false}>
      <View className="flex-1 items-center justify-center">
        <View className="h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-6">
          <RefreshCw size={36} color="#7C3AED" />
        </View>
        <Text className="text-body text-foreground-secondary text-center px-6 leading-6">
          Your session may have expired or been interrupted. You can attempt to recover it locally without losing your data.
        </Text>
      </View>
      <View className="gap-3">
        <Button label="Recover Session" size="lg" onPress={handleRecover} />
        <Button label="Sign In Again" variant="outline" onPress={handleReLogin} />
      </View>
    </AuthScreenLayout>
  );
}
