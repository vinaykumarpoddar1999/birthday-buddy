import { useState } from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Input } from '@shared/ui';
import { useAuth } from '@features/auth';
import { handleApiError } from '@shared/errors';
import { logger } from '@services/logging';

export default function LoginScreen() {
  const { signIn, isSigningIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  async function onSubmit() {
    setError(undefined);
    try {
      await signIn();
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);
      logger.error('auth.login.failed', { message: appError.message });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6 gap-4">
        <Text className="text-2xl font-bold text-foreground">Welcome to BirthdayBuddy</Text>
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
        <Button label="Sign in" loading={isSigningIn} onPress={onSubmit} />
        <Link href="/(auth)/register" className="text-primary text-center">
          Create an account
        </Link>
      </View>
    </SafeAreaView>
  );
}
