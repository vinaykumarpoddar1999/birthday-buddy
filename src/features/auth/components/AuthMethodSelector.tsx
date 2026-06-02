import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import type { AuthMethod } from '@features/auth/types/auth.types';

export type AuthMethodOption = {
  id: AuthMethod;
  label: string;
  icon: LucideIcon;
};

type AuthMethodSelectorProps = {
  options: AuthMethodOption[];
  value: AuthMethod;
  onChange: (method: AuthMethod) => void;
};

export function AuthMethodSelector({ options, value, onChange }: AuthMethodSelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.id;
        const Icon = opt.icon;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange(opt.id)}
            className={`flex-row items-center gap-2 px-3.5 py-2.5 rounded-2xl border ${
              active ? 'bg-primary border-primary shadow-sm' : 'bg-surface border-border'
            }`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}>
            <Icon size={16} color={active ? '#FFFFFF' : '#6B7280'} />
            <Text
              className={`text-caption font-semibold ${active ? 'text-white' : 'text-foreground-secondary'}`}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
