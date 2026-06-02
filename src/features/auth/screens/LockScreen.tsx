import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { AuthHero, AuthScreenLayout, PinKeypad } from '../components';

export function LockScreen() {
  const { unlock, user, securityPreferences } = useAuth();
  const { showError } = useFeedback();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const pinLength = securityPreferences?.pinLength ?? 4;

  const handleUnlockWithPin = async (value: string) => {
    setPin(value);
    if (value.length !== pinLength) return;

    setLoading(true);
    const success = await unlock({
      identifier: user?.email ?? user?.phone ?? '',
      pin: value,
      authMethod: pinLength === 6 ? 'pin_6' : 'pin_4',
    });
    setLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      showError('Incorrect PIN', 'Please try again.');
      setPin('');
    }
  };

  const handleBiometricUnlock = async () => {
    setLoading(true);
    const success = await unlock({
      identifier: user?.email ?? user?.phone ?? '',
      authMethod: securityPreferences?.devicePasscodeEnabled ? 'device_passcode' : 'biometric',
    });
    setLoading(false);
    if (success) router.replace('/(tabs)');
    else showError('Authentication Failed', 'Verification failed. Try your PIN or password.');
  };

  const displayName = user?.nickname || user?.fullName || 'there';

  return (
    <AuthScreenLayout scrollable={false}>
      <View className="flex-1 justify-between">
        <AuthHero
          icon={Lock}
          compact
          title="App Locked"
          subtitle={`Welcome back, ${displayName}. Authenticate to continue.`}
        />

        <View className="flex-1 justify-center">
          {securityPreferences?.pinEnabled && (
            <PinKeypad value={pin} maxLength={pinLength} onChange={handleUnlockWithPin} label="Enter PIN" />
          )}

          {securityPreferences?.biometricEnabled && (
            <View className={`${securityPreferences?.pinEnabled ? 'mt-6' : ''}`}>
              <Button
                label="Unlock with Biometrics"
                variant="outline"
                loading={loading}
                onPress={handleBiometricUnlock}
                size="lg"
              />
            </View>
          )}

          {!securityPreferences?.pinEnabled && !securityPreferences?.biometricEnabled && (
            <Button label="Unlock with Password" onPress={() => router.replace('/(auth)/login')} size="lg" />
          )}
        </View>

        <Text className="text-caption text-foreground-muted text-center pb-4">
          Your data stays encrypted on this device
        </Text>
      </View>
    </AuthScreenLayout>
  );
}
