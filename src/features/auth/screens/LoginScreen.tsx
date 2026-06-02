import { Link, router } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button, Input } from '@shared/ui';
import { useAuth } from '@features/auth';
import { AuthHero, AuthScreenLayout } from '../components';

export function LoginScreen() {
  const { signIn, isSigningIn, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit() {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await signIn({
        identifier: email.trim(),
        password,
        authMethod: 'email_password',
      });
      router.replace('/(tabs)');
    } catch {
      /* error surfaced via hook */
    }
  }

  return (
    <AuthScreenLayout
      showBack
      hero={
        <AuthHero
          icon={LogIn}
          compact
          iconColor="#6366F1"
          iconBg="#EEF2FF"
          title="Welcome Back"
          subtitle="Sign in to access your saved birthdays and profile."
        />
      }>
      <View className="bg-white rounded-3xl p-6 shadow-sm border border-border/40 gap-5">
        <Input
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: '' }));
          }}
          error={fieldErrors.email}
        />

        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: '' }));
          }}
          error={fieldErrors.password}
        />

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <Text className="text-sm text-red-600 font-medium">{error}</Text>
          </View>
        ) : null}

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable className="self-end" accessibilityRole="link">
            <Text className="text-primary text-sm font-semibold">Forgot password?</Text>
          </Pressable>
        </Link>
      </View>

      <View className="mt-8 gap-4">
        <Button label="Sign In" loading={isSigningIn} onPress={onSubmit} size="lg" />

        <View className="flex-row items-center justify-center gap-2">
          <Text className="text-foreground-secondary text-sm">Don't have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/register')} accessibilityRole="link">
            <Text className="text-primary font-semibold text-sm">Create one</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
