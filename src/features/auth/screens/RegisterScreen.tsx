import { router } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button, Input } from '@shared/ui';
import { useAuth, type SignUpInput } from '@features/auth';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { AuthHero, AuthScreenLayout } from '../components';

export function RegisterScreen() {
  const { signUp, isSigningUp, error } = useAuth();
  const { showSuccess } = useFeedback();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      showSuccess('Welcome!', 'Your account has been created. You can add more details anytime in Edit Profile.', () => {
        router.replace('/(tabs)');
      });
    } catch {
      /* error surfaced via hook */
    }
  };

  return (
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
  );
}
