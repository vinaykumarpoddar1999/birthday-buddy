import { router } from 'expo-router';
import { Copy, UserPlus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { Button, Input } from '@shared/ui';
import { useAuth, type SignUpInput } from '@features/auth';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { useAuthStore } from '@/stores/auth.store';
import { AuthHero, AuthScreenLayout } from '../components';

export function RegisterScreen() {
  const { signUp, isSigningUp, error } = useAuth();
  const recoveryCode = useAuthStore((s) => s.recoveryCode);
  const { showSuccess, toast } = useFeedback();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  useEffect(() => {
    if (recoveryCode) {
      setShowRecoveryModal(true);
    }
  }, [recoveryCode]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Name is required';
    if (!dateOfBirth.trim()) errors.dateOfBirth = 'Date of birth is required';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim())) {
      errors.dateOfBirth = 'Use format YYYY-MM-DD';
    }
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'At least 8 characters';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const input: SignUpInput = {
      fullName: fullName.trim(),
      email: email.trim(),
      dateOfBirth: dateOfBirth.trim(),
      password,
    };

    try {
      await signUp(input);
    } catch (err) {
      if (err instanceof Error && err.message.includes('already exists')) {
        setFieldErrors((e) => ({ ...e, email: 'An account with this email already exists. Try signing in.' }));
      }
    }
  };

  const handleRecoveryContinue = () => {
    setShowRecoveryModal(false);
    showSuccess('Welcome!', 'Your account has been created.', () => {
      router.replace('/(tabs)');
    });
  };

  const copyRecoveryCode = async () => {
    if (!recoveryCode) return;
    await Clipboard.setStringAsync(recoveryCode);
    toast('Recovery code copied', 'success');
  };

  return (
    <>
      <AuthScreenLayout
        showBack
        hero={
          <AuthHero
            icon={UserPlus}
            compact
            iconColor="#7C3AED"
            iconBg="#EDE9FE"
            title="Create Account"
            subtitle="Just the essentials — you can complete your profile later."
          />
        }>
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-border/40 gap-5">
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={(v) => {
              setFullName(v);
              if (fieldErrors.fullName) setFieldErrors((e) => ({ ...e, fullName: '' }));
            }}
            placeholder="John Doe"
            error={fieldErrors.fullName}
            autoCapitalize="words"
          />

          <Input
            label="Your Date of Birth"
            value={dateOfBirth}
            onChangeText={(v) => {
              setDateOfBirth(v);
              if (fieldErrors.dateOfBirth) setFieldErrors((e) => ({ ...e, dateOfBirth: '' }));
            }}
            placeholder="YYYY-MM-DD"
            error={fieldErrors.dateOfBirth}
            keyboardType="numbers-and-punctuation"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: '' }));
            }}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            error={fieldErrors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: '' }));
            }}
            secureTextEntry
            placeholder="Minimum 8 characters"
            error={fieldErrors.password}
          />

          {error ? (
            <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <Text className="text-sm text-red-600 font-medium">{error}</Text>
              {error.includes('already exists') ? (
                <Pressable onPress={() => router.push('/(auth)/login')} className="mt-2" accessibilityRole="link">
                  <Text className="text-sm text-primary font-semibold">Go to Sign In</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>

        <View className="mt-8 gap-4">
          <Button label="Create Account" loading={isSigningUp} onPress={handleSubmit} size="lg" />

          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-foreground-secondary text-sm">Already have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')} accessibilityRole="link">
              <Text className="text-primary font-semibold text-sm">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </AuthScreenLayout>

      <Modal visible={showRecoveryModal} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center px-6">
          <View className="bg-surface rounded-3xl p-6">
            <Text className="text-[18px] font-bold text-foreground mb-2">Save Your Recovery Code</Text>
            <Text className="text-[13px] text-foreground-secondary leading-5 mb-4">
              Store this code safely. You will need it to reset your password if you forget it.
            </Text>
            <View className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex-row items-center justify-between mb-4">
              <Text className="text-[22px] font-bold text-primary tracking-widest">{recoveryCode}</Text>
              <Pressable onPress={() => void copyRecoveryCode()} accessibilityRole="button" accessibilityLabel="Copy recovery code">
                <Copy size={20} color="#7C3AED" />
              </Pressable>
            </View>
            <Button label="I Saved My Code — Continue" size="lg" onPress={handleRecoveryContinue} />
          </View>
        </View>
      </Modal>
    </>
  );
}
