import { router } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Input } from '@shared/ui';
import { authService } from '@/services/auth/auth.service';
import { userRepository } from '@/repositories/user.repository';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { AuthHero, AuthScreenLayout, PasswordStrengthMeter } from '../components';

export function ForgotPasswordScreen() {
  const { showSuccess, showError } = useFeedback();
  const [identifier, setIdentifier] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'identify' | 'recover'>('identify');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIdentify = async () => {
    if (!identifier.trim()) {
      showError('Required', 'Enter your email or phone number.');
      return;
    }
    setLoading(true);
    try {
      const user =
        (await userRepository.findByEmail(identifier)) ??
        (await userRepository.findByPhone(identifier));
      if (!user) {
        showError('Not Found', 'No account found with that email or phone.');
        return;
      }
      setUserId(user.id);
      setStep('recover');
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async () => {
    if (!userId) return;
    if (newPassword !== confirmPassword) {
      showError('Mismatch', 'Passwords do not match.');
      return;
    }
    const strength = authService.evaluatePasswordStrength(newPassword);
    if (strength.score < 100) {
      showError('Weak Password', 'Password does not meet security requirements.');
      return;
    }
    setLoading(true);
    try {
      await authService.recoverWithCode(userId, recoveryCode, newPassword);
      showSuccess('Password Reset', 'Your password has been updated. You can now sign in.', () =>
        router.replace('/(auth)/login'),
      );
    } catch {
      showError('Recovery Failed', 'Invalid recovery code. Use the code saved during account setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      showBack
      hero={
        <AuthHero
          icon={KeyRound}
          compact
          title="Reset Password"
          subtitle={
            step === 'identify'
              ? 'Offline recovery uses your recovery code from signup.'
              : 'Enter your recovery code and choose a new password.'
          }
        />
      }>
      <View className="gap-4">
        {step === 'identify' ? (
          <>
            <Input
              label="Email or Phone"
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="you@example.com"
              autoCapitalize="none"
            />
            <Button label="Continue" loading={loading} onPress={handleIdentify} size="lg" />
          </>
        ) : (
          <>
            <Input
              label="Recovery Code"
              value={recoveryCode}
              onChangeText={setRecoveryCode}
              placeholder="Code from account setup"
              autoCapitalize="characters"
            />
            <Input label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            <PasswordStrengthMeter password={newPassword} />
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <Button label="Reset Password" loading={loading} onPress={handleRecover} size="lg" />
          </>
        )}
      </View>
    </AuthScreenLayout>
  );
}
