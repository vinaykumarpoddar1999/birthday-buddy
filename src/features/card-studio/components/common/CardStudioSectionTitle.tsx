import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
};

export function CardStudioSectionTitle({ title, icon, subtitle }: Props) {
  return (
    <View className="flex-row items-center mb-1 gap-2 flex-1">
      {icon}
      <View className="flex-1 min-w-0">
        <Text className="text-[14px] font-bold text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="text-caption text-foreground-secondary mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}
