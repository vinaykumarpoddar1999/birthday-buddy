import { Image } from 'expo-image';
import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

const LOGO = require('../../../assets/images/expo-logo.png');

export type TabScreenHeaderProps = {
  title: string;
  rightAction?: ReactNode;
};

export function TabScreenHeader({ title, rightAction }: TabScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4 pt-1">
      <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
        <Image
          source={LOGO}
          style={{ width: 32, height: 32, borderRadius: 8 }}
          contentFit="cover"
          accessibilityLabel="Birthday Buddy logo"
        />
        <Text className="text-[26px] leading-[32px] text-foreground font-bold" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightAction ? <View className="shrink-0 ml-2">{rightAction}</View> : null}
    </View>
  );
}
