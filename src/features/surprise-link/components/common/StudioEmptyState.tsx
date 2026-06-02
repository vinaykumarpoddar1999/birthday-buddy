import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { SURPRISE_STUDIO } from '../../constants/surprise-studio.tokens';

interface StudioEmptyStateProps {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function StudioEmptyState({
  Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: StudioEmptyStateProps) {
  return (
    <Animated.View entering={FadeInDown.duration(400).springify()} className="px-5 py-8 items-center">
      <LinearGradient
        colors={[...SURPRISE_STUDIO.gradient.intro]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full rounded-2xl p-8 items-center border border-primary/10">
        <View className="h-16 w-16 rounded-2xl bg-primary/10 items-center justify-center mb-4">
          <Icon size={32} color={SURPRISE_STUDIO.color.primary} strokeWidth={2} />
        </View>
        <Text className="text-[17px] font-black text-foreground text-center">{title}</Text>
        <Text className="text-[13px] text-foreground-secondary text-center mt-2 leading-5 px-2">
          {subtitle}
        </Text>
        {actionLabel && onAction ? (
          <Pressable
            onPress={onAction}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            className="mt-5 rounded-xl overflow-hidden"
            style={{ minHeight: SURPRISE_STUDIO.touch.min }}>
            <LinearGradient
              colors={[...SURPRISE_STUDIO.gradient.cta]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-6 py-3.5 items-center justify-center">
              <Text className="text-[14px] font-black text-white">{actionLabel}</Text>
            </LinearGradient>
          </Pressable>
        ) : null}
      </LinearGradient>
    </Animated.View>
  );
}
