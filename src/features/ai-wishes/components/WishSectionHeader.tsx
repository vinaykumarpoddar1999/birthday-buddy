import React from 'react';
import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { WishColors } from '../constants/design-tokens';

interface WishSectionHeaderProps {
  step: number;
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
}

export function WishSectionHeader({ step, title, subtitle, Icon }: WishSectionHeaderProps) {
  return (
    <View className="px-5 mb-3">
      <View className="flex-row items-center gap-3">
        <View className="h-9 w-9 rounded-xl bg-primary/12 items-center justify-center">
          {Icon ? (
            <Icon size={16} color={WishColors.primary} strokeWidth={2.5} />
          ) : (
            <Text className="text-[14px] font-extrabold text-primary">{step}</Text>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-[16px] font-extrabold text-foreground tracking-tight">{title}</Text>
          {subtitle ? (
            <Text className="text-[12px] font-medium text-foreground-secondary mt-0.5">{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
