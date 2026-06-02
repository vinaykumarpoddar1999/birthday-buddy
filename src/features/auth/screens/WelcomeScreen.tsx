import { Link, router } from 'expo-router';
import { Cake, Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';
import { AuthHero, AuthScreenLayout } from '../components';

export function WelcomeScreen() {
  const { enterGuestMode } = useAuth();

  const handleContinueAsGuest = async () => {
    await enterGuestMode();
    router.replace('/(tabs)');
  };

  return (
    <AuthScreenLayout
      scrollable={false}
      hero={
        <AuthHero
          icon={Cake}
          iconColor="#7C3AED"
          iconBg="#EDE9FE"
          title="BirthdayBuddy"
          subtitle="Never miss a special day. Track birthdays, send wishes, and celebrate the people you love."
          showTrustBadge
        />
      }
      footer={
        <View className="gap-3">
          <Button label="Create Account" size="lg" onPress={() => router.push('/(auth)/register')} />
          <Link href="/(auth)/login" asChild>
            <Button label="Sign In" variant="outline" size="lg" />
          </Link>
          <Pressable
            onPress={handleContinueAsGuest}
            className="py-3 items-center"
            accessibilityRole="button"
            accessibilityLabel="Continue without account">
            <Text className="text-foreground-secondary text-sm font-medium">
              Continue without account
            </Text>
          </Pressable>
          <View className="flex-row items-center justify-center gap-1.5 pt-1">
            <Sparkles size={12} color="#9CA3AF" />
            <Text className="text-xs text-foreground-muted">Offline-first · Private · No cloud required</Text>
          </View>
        </View>
      }>
      <View className="flex-1 justify-center px-2">
        <View className="gap-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <View
                key={feature.title}
                className="flex-row items-center gap-4 bg-white/70 rounded-2xl px-4 py-3.5 border border-border/30">
                <LinearGradient
                  colors={feature.gradient}
                  className="h-10 w-10 rounded-xl items-center justify-center">
                  <Icon size={20} color="#FFFFFF" />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-foreground">{feature.title}</Text>
                  <Text className="text-xs text-foreground-secondary mt-0.5">{feature.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </AuthScreenLayout>
  );
}

const FEATURES = [
  {
    icon: Cake,
    title: 'Track Birthdays',
    desc: 'Keep every special day in one place',
    gradient: ['#7C3AED', '#9333EA'] as [string, string],
  },
  {
    icon: Sparkles,
    title: 'Send Wishes',
    desc: 'AI-powered messages & beautiful cards',
    gradient: ['#EC4899', '#F472B6'] as [string, string],
  },
  {
    icon: Sparkles,
    title: 'Smart Reminders',
    desc: 'Never forget to celebrate again',
    gradient: ['#3B82F6', '#6366F1'] as [string, string],
  },
] as const;
