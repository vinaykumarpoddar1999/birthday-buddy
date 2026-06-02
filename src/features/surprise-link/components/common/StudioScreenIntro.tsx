import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SURPRISE_STUDIO } from '../../constants/surprise-studio.tokens';

interface StudioScreenIntroProps {
  title: string;
  subtitle: string;
  Icon?: LucideIcon;
  badge?: string;
}

export function StudioScreenIntro({
  title,
  subtitle,
  Icon,
  badge = 'Surprise Link Studio',
}: StudioScreenIntroProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(350).springify()}
      className="px-5 mt-1 mb-3">
      <LinearGradient
        colors={[...SURPRISE_STUDIO.gradient.intro]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-4 border border-primary/10">
        <View className="flex-row items-center mb-2.5 gap-2.5">
          {Icon ? (
            <View className="h-10 w-10 rounded-xl bg-primary items-center justify-center">
              <Icon size={18} color="#FFFFFF" strokeWidth={2.2} />
            </View>
          ) : null}
          <View className="bg-primary/10 px-2.5 py-1 rounded-lg">
            <Text className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
              {badge}
            </Text>
          </View>
        </View>
        <Text className="text-[20px] font-black text-foreground tracking-tight leading-7">
          {title}
        </Text>
        <Text className="text-[13px] font-medium text-foreground-secondary mt-1 leading-5">
          {subtitle}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}
