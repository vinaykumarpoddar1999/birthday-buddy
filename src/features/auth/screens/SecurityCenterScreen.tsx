import { router } from 'expo-router';
import { ArrowLeft, Fingerprint, Lock, Shield, Smartphone } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@features/auth';
import { authService } from '@/services/auth/auth.service';
import { userSecurityRepository } from '@/repositories/user-security.repository';

export function SecurityCenterScreen() {
  const {
    user,
    securityPreferences,
    loginHistory,
    trustedDevices,
    loadSecurityData,
  } = useAuth();

  useEffect(() => {
    void loadSecurityData();
  }, [loadSecurityData]);

  if (!user || !securityPreferences) return null;

  const securityScore = authService.calculateSecurityScore(
    securityPreferences,
    securityPreferences.pinEnabled,
    securityPreferences.biometricEnabled,
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Security Center</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 rounded-2xl p-5 border border-primary/20 mt-2">
          <View className="flex-row items-center gap-3 mb-3">
            <Shield size={24} color="#7C3AED" />
            <Text className="text-[18px] font-bold text-foreground">Security Score</Text>
          </View>
          <Text className="text-[36px] font-bold text-primary">{securityScore.score}%</Text>
          <Text className="text-body text-foreground-secondary capitalize mt-1">{securityScore.level} protection</Text>
          {securityScore.recommendations.map((rec) => (
            <Text key={rec} className="text-caption text-foreground-secondary mt-2">• {rec}</Text>
          ))}
        </View>

        <Section title="Authentication">
          <InfoRow icon={Lock} label="Primary Method" value={securityPreferences.primaryAuthMethod.replace('_', ' ')} />
          <InfoRow icon={Fingerprint} label="Biometrics" value={securityPreferences.biometricEnabled ? 'Enabled' : 'Disabled'} />
          <InfoRow icon={Lock} label="PIN" value={securityPreferences.pinEnabled ? `${securityPreferences.pinLength}-digit` : 'Not set'} />
          <InfoRow icon={Lock} label="App Lock" value={securityPreferences.appLockEnabled ? 'Enabled' : 'Disabled'} />
          <InfoRow icon={Lock} label="Auto Lock" value={`${securityPreferences.autoLockTimer} min`} />
        </Section>

        <Section title="Session">
          <InfoRow icon={Smartphone} label="Status" value="Active" />
          <InfoRow icon={Smartphone} label="Last Login" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'} />
        </Section>

        <Section title="Trusted Devices">
          {trustedDevices.map((device) => (
            <View key={device.id} className="py-2 border-b border-border/40">
              <Text className="text-body font-medium text-foreground">{device.deviceName}</Text>
              <Text className="text-caption text-foreground-secondary">
                {device.platform} • {device.isCurrent ? 'This device' : 'Trusted'}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Login History">
          {loginHistory.slice(0, 5).map((entry) => (
            <View key={entry.id} className="py-2 border-b border-border/40">
              <Text className="text-body text-foreground">
                {entry.success ? 'Successful login' : 'Failed attempt'}
              </Text>
              <Text className="text-caption text-foreground-secondary">
                {new Date(entry.loginAt).toLocaleString()} • {entry.authMethod}
              </Text>
            </View>
          ))}
        </Section>

        <Pressable
          className="bg-surface rounded-2xl px-4 py-4 border border-border/60 mt-4"
          onPress={() => router.push('/privacy-security')}
          accessibilityRole="button">
          <Text className="text-body font-semibold text-primary text-center">Manage Security Settings</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-5">
      <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">{title}</Text>
      <View className="bg-surface rounded-2xl px-4 border border-border/60">{children}</View>
    </View>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Lock; label: string; value: string }) {
  return (
    <View className="flex-row items-center py-3 border-b border-border/40 last:border-b-0">
      <Icon size={16} color="#6B7280" />
      <Text className="text-body text-foreground flex-1 ml-3">{label}</Text>
      <Text className="text-body text-foreground-secondary capitalize">{value}</Text>
    </View>
  );
}

export async function getSecurityStatus(userId: string) {
  return userSecurityRepository.findByUserUuid(userId);
}
