import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SURPRISE_STUDIO } from '../../constants/surprise-studio.tokens';

interface StudioHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
}

export function StudioHeader({ title, onBack, rightAction }: StudioHeaderProps) {
  return (
    <View className="px-5 py-3">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-11 w-11 rounded-xl bg-white border border-gray-100 items-center justify-center"
          style={{
            shadowColor: SURPRISE_STUDIO.color.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <ChevronLeft size={22} color={SURPRISE_STUDIO.color.primary} />
        </Pressable>
        <View className="flex-1 items-center mx-2">
          <View className="flex-row items-center gap-1 mb-0.5">
            <Sparkles size={12} color={SURPRISE_STUDIO.color.primary} />
            <Text className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
              Surprise Link Studio
            </Text>
          </View>
          <Text className="text-[16px] font-black text-foreground text-center" numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View className="min-w-[44px] items-end justify-center">{rightAction}</View>
      </View>
    </View>
  );
}

interface ContinueButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ContinueButton({
  label = 'Continue',
  onPress,
  disabled,
  loading,
}: ContinueButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <View
      className="px-5 pt-2 pb-5 border-t border-border/30"
      style={{ backgroundColor: SURPRISE_STUDIO.color.footerBg }}>
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={loading ? 'Please wait' : label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        className="rounded-2xl overflow-hidden"
        style={({ pressed }) => [
          { minHeight: SURPRISE_STUDIO.touch.min, opacity: isDisabled ? 0.55 : 1 },
          pressed && !isDisabled && { transform: [{ scale: 0.98 }] },
        ]}>
        <LinearGradient
          colors={
            isDisabled
              ? (['#9CA3AF', '#6B7280'] as const)
              : ([...SURPRISE_STUDIO.gradient.cta] as const)
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="py-4 items-center justify-center flex-row gap-2">
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : null}
          <Text className="text-[15px] font-extrabold text-white">{loading ? 'Working...' : label}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
