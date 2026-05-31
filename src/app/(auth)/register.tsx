import { useState } from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '@shared/ui';
import { useAuth } from '@features/auth';
import { handleApiError } from '@shared/errors';
import { logger } from '@services/logging';

export default function RegisterScreen() {
  const { signUp, isSigningUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  async function onSubmit() {
    setError(undefined);
    try {
      await signUp({ email: email.trim(), password, name: name.trim() || undefined });
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      logger.error('auth.register.failed', { message: appError.message });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6 gap-4">
        <Text className="text-2xl font-bold text-foreground">Create account</Text>
        <Input label="Name" placeholder="Your name" value={name} onChangeText={setName} />
        <Input
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={error}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button label="Sign up" loading={isSigningUp} onPress={onSubmit} />
        <Link href="/(auth)/login" className="text-primary text-center">
          Already have an account?
        </Link>
      </View>
    </SafeAreaView>
  );
}
