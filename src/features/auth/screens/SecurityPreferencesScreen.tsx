import { router } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@shared/ui';
import { useAuth, type AutoLockTimer } from '@features/auth';
import { useFeedback } from '@/shared/hooks/useFeedback';
import { AuthHero, AuthScreenLayout, SecurityOptionCard } from '../components';

const AUTO_LOCK_OPTIONS: { value: AutoLockTimer; label: string }[] = [
  { value: 'immediate', label: 'Immediately' },
  { value: '1', label: '1 min' },
  { value: '5', label: '5 min' },
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hour' },
  { value: 'never', label: 'Never' },
];

export function SecurityPreferencesScreen() {
  const { securityPreferences, updateSecurityPreferences } = useAuth();
  const { showSuccess } = useFeedback();
  const [saving, setSaving] = useState(false);

  if (!securityPreferences) return null;

  const update = async (patch: Parameters<typeof updateSecurityPreferences>[0]) => {
    setSaving(true);
    try {
      await updateSecurityPreferences(patch);
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    showSuccess('Security Configured', 'Your security preferences have been saved.', () =>
      router.replace('/(auth)/permissions'),
    );
  };

  return (
    <AuthScreenLayout
      hero={
        <AuthHero
          icon={Shield}
          compact
          title="Security Setup"
          subtitle="Choose how BirthdayBuddy locks and how you unlock it."
          showTrustBadge
        />
      }>
      <View className="gap-3">
        <SecurityOptionCard
          label="Enable App Lock"
          description="Require authentication when returning to the app."
          value={securityPreferences.appLockEnabled}
          onChange={(v) => update({ appLockEnabled: v })}
        />
        <SecurityOptionCard
          label="Lock on Background"
          description="Lock immediately when you leave the app."
          value={securityPreferences.lockOnBackground}
          onChange={(v) => update({ lockOnBackground: v })}
        />
        <SecurityOptionCard
          label="Lock on App Restart"
          description="Require unlock after closing and reopening."
          value={securityPreferences.lockOnRestart}
          onChange={(v) => update({ lockOnRestart: v })}
        />
        <SecurityOptionCard
          label="Remember This Device"
          description="Stay signed in on this device until you log out."
          value={securityPreferences.rememberDevice}
          onChange={(v) => update({ rememberDevice: v })}
        />
      </View>

      <Text className="text-caption text-foreground-secondary uppercase font-bold mt-8 mb-3 tracking-wide">
        Auto Lock Timer
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {AUTO_LOCK_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            label={opt.label}
            variant={securityPreferences.autoLockTimer === opt.value ? 'primary' : 'outline'}
            size="sm"
            onPress={() => update({ autoLockTimer: opt.value })}
          />
        ))}
      </View>

      <View className="mt-10">
        <Button label="Save & Continue" loading={saving} onPress={handleFinish} size="lg" />
      </View>
    </AuthScreenLayout>
  );
}
