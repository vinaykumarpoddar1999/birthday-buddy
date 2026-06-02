import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { AuthScreenLayout, PinKeypad } from '../components';

export function PinSetupScreen() {
  const { setupPin, updateSecurityPreferences } = useAuth();
  const { showError, showSuccess } = useFeedback();
  const params = useLocalSearchParams<{ length?: string }>();
  const pinLength = (Number(params.length) === 6 ? 6 : 4) as 4 | 6;

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [phase, setPhase] = useState<'create' | 'confirm'>('create');
  const [loading, setLoading] = useState(false);

  const handlePinComplete = async (value: string) => {
    if (phase === 'create') {
      setPin(value);
      if (value.length === pinLength) {
        setPhase('confirm');
        setConfirmPin('');
      }
      return;
    }

    setConfirmPin(value);
    if (value.length !== pinLength) return;

    if (value !== pin) {
      showError('PIN Mismatch', 'PINs do not match. Try again.');
      setPhase('create');
      setPin('');
      setConfirmPin('');
      return;
    }

    setLoading(true);
    try {
      await setupPin(pin, pinLength);
      await updateSecurityPreferences({ pinEnabled: true, pinLength, securitySetupCompleted: true });
      showSuccess('PIN Set', 'Your PIN has been configured securely.', () =>
        router.replace('/(auth)/permissions'),
      );
    } catch {
      showError('Setup Failed', 'Could not save PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      title={phase === 'create' ? 'Create PIN' : 'Confirm PIN'}
      subtitle={`Choose a ${pinLength}-digit PIN for quick secure access.`}
      scrollable={false}>
      <View className="flex-1 justify-center">
        <PinKeypad
          value={phase === 'create' ? pin : confirmPin}
          maxLength={pinLength}
          onChange={handlePinComplete}
          label={phase === 'create' ? 'Enter your PIN' : 'Confirm your PIN'}
        />
      </View>
      {loading && <Button label="Saving..." loading disabled />}
    </AuthScreenLayout>
  );
}
