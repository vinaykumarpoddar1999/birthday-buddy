import { Lock } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { biometricService } from '@/services/auth/biometric.service';
import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { useAuthStore } from '@/stores/auth.store';
import { AuthHero, AuthScreenLayout } from '../components';

export function LockScreen() {
  const { user, securityPreferences } = useAuth();
  const setLocked = useAuthStore((s) => s.setLocked);
  const { showError } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [lockMethodLabel, setLockMethodLabel] = useState('Device security');

  const useSystemLock = securityPreferences?.appLockEnabled ?? false;
  const isGuestSession = !user;

  useEffect(() => {
    void (async () => {
      const caps = await biometricService.getCapabilities();
      setLockMethodLabel(biometricService.getSystemLockLabel(caps.supportedTypes));
    })();
  }, []);

  const finishUnlock = () => {
    setLocked(false);
  };

  const handleSystemUnlock = async () => {
    setLoading(true);
    const result = await biometricService.authenticate('Unlock Birthday Buddy');
    setLoading(false);
    if (result.success) {
      finishUnlock();
    } else {
      showError('Authentication Failed', 'Verification was cancelled or failed.');
    }
  };

  useEffect(() => {
    if (!useSystemLock) return;
    void handleSystemUnlock();
    // Auto-prompt once when lock screen opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = user?.nickname || user?.fullName || 'there';

  return (
    <AuthScreenLayout scrollable={false}>
      <View className="flex-1 justify-between">
        <AuthHero
          icon={Lock}
          compact
          title="App Locked"
          subtitle={
            isGuestSession
              ? 'Authenticate with your device security to continue.'
              : `Welcome back, ${displayName}. Authenticate to continue.`
          }
        />
        <View className="flex-1 justify-center px-2">
          <Button
            label={`Unlock with ${lockMethodLabel}`}
            variant="primary"
            loading={loading}
            onPress={handleSystemUnlock}
            size="lg"
          />
        </View>
        <Text className="text-caption text-foreground-muted text-center pb-4">
          Your data stays private on this device
        </Text>
      </View>
    </AuthScreenLayout>
  );
}
