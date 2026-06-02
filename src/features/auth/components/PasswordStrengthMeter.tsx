import { Text, View } from 'react-native';

import { authService } from '@/services/auth/auth.service';
import type { PasswordStrength } from '@features/auth/types/auth.types';

type PasswordStrengthMeterProps = {
  password: string;
};

const STRENGTH_COLORS: Record<PasswordStrength['label'], string> = {
  weak: '#EF4444',
  fair: '#F59E0B',
  good: '#3B82F6',
  strong: '#22C55E',
};

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = authService.evaluatePasswordStrength(password);
  const color = STRENGTH_COLORS[strength.label];

  if (!password) return null;

  return (
    <View className="mt-2">
      <View className="flex-row h-1.5 rounded-full overflow-hidden bg-border/40">
        {[20, 40, 60, 80, 100].map((threshold) => (
          <View
            key={threshold}
            className="flex-1 mx-0.5 rounded-full"
            style={{
              backgroundColor: strength.score >= threshold ? color : '#E5E7EB',
            }}
          />
        ))}
      </View>
      <Text className="text-caption text-foreground-secondary mt-1.5 capitalize">
        Password strength: {strength.label}
      </Text>
      <View className="flex-row flex-wrap gap-x-3 mt-2">
        {Object.entries(strength.checks).map(([key, passed]) => (
          <Text
            key={key}
            className={`text-[11px] ${passed ? 'text-success' : 'text-foreground-secondary'}`}>
            {passed ? '✓' : '○'}{' '}
            {key === 'minLength'
              ? '8+ chars'
              : key === 'uppercase'
                ? 'Uppercase'
                : key === 'lowercase'
                  ? 'Lowercase'
                  : key === 'number'
                    ? 'Number'
                    : 'Special'}
          </Text>
        ))}
      </View>
    </View>
  );
}
