import { router } from 'expo-router';
import { Fingerprint, ScanFace } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { biometricService } from '@/services/auth/biometric.service';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { AuthScreenLayout } from '../components';

export function BiometricSetupScreen() {
  const { updateSecurityPreferences } = useAuth();
  const { showSuccess, showError } = useFeedback();

  const handleEnable = async () => {
    const caps = await biometricService.getCapabilities();
    if (!caps.hasHardware || !caps.isEnrolled) {
      showError('Unavailable', 'Set up biometrics on your device first.');
      return;
    }

    const result = await biometricService.authenticate('Enable biometric login');
    if (!result.success) {
      showError('Failed', result.error ?? 'Authentication failed');
      return;
    }

    await updateSecurityPreferences({
      biometricEnabled: true,
      faceIdEnabled: caps.biometricType === 'facial',
      fingerprintEnabled: caps.biometricType === 'fingerprint',
      securitySetupCompleted: true,
    });

    showSuccess('Biometrics Enabled', 'You can now unlock with Face ID or fingerprint.', () =>
      router.replace('/(auth)/permissions'),
    );
  };

  const handleSkip = () => {
    router.replace('/(auth)/permissions');
  };

  return (
    <AuthScreenLayout
      title="Biometric Login"
      subtitle="Unlock BirthdayBuddy instantly with Face ID or fingerprint."
      scrollable={false}>
      <View className="flex-1 items-center justify-center">
        <View className="flex-row gap-4 mb-8">
          <View className="h-20 w-20 rounded-2xl bg-primary/10 items-center justify-center">
            <ScanFace size={40} color="#7C3AED" />
          </View>
          <View className="h-20 w-20 rounded-2xl bg-secondary/10 items-center justify-center">
            <Fingerprint size={40} color="#EC4899" />
          </View>
        </View>
        <Text className="text-body text-foreground-secondary text-center px-4 leading-6">
          Your biometric data never leaves your device. We only verify your identity locally.
        </Text>
      </View>
      <View className="gap-3">
        <Button label="Enable Biometrics" size="lg" onPress={handleEnable} />
        <Button label="Skip for Now" variant="ghost" onPress={handleSkip} />
      </View>
    </AuthScreenLayout>
  );
}
