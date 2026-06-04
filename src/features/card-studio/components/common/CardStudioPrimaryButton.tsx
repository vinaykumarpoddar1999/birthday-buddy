import React from 'react';
import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { studioTokens } from '../../constants/studio-tokens';

type Props = PressableProps & {
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
};

export function CardStudioPrimaryButton({
  label,
  icon,
  loading = false,
  disabled,
  fullWidth = true,
  className,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={`overflow-hidden rounded-2xl ${fullWidth ? 'flex-1' : ''} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => ({ transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }] })}
      {...props}>
      <LinearGradient
        colors={[...studioTokens.colors.gradientPrimary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View
          className="flex-row items-center justify-center gap-2"
          style={{ minHeight: studioTokens.touchMin, paddingVertical: 14 }}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              {icon}
              <Text className="text-[15px] font-bold text-white">{label}</Text>
            </>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}
