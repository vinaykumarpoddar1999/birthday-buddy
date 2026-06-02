import type { ReactNode } from 'react';
import { Switch, Text, View } from 'react-native';

type SecurityOptionCardProps = {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trailing?: ReactNode;
};

export function SecurityOptionCard({
  label,
  description,
  value,
  onChange,
  trailing,
}: SecurityOptionCardProps) {
  return (
    <View className="bg-surface rounded-2xl px-4 py-4 border border-border/60 shadow-sm">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-body text-foreground font-semibold">{label}</Text>
          {description ? (
            <Text className="text-caption text-foreground-secondary mt-1 leading-5">{description}</Text>
          ) : null}
        </View>
        {trailing ?? (
          <Switch
            value={value}
            onValueChange={onChange}
            trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
            accessibilityLabel={label}
          />
        )}
      </View>
    </View>
  );
}
