import React from 'react';
import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';

import { studioTokens } from '../../constants/studio-tokens';

type Props = PressableProps & {
  label: string;
  icon?: React.ReactNode;
  loading?: boolean;
};

export function CardStudioSecondaryButton({
  label,
  icon,
  loading = false,
  disabled,
  className,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={`flex-row items-center justify-center bg-surface rounded-2xl px-5 gap-1.5 border border-border ${
        isDisabled ? 'opacity-50' : ''
      } ${className ?? ''}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => ({
        minHeight: studioTokens.touchMin,
        paddingVertical: 14,
        transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
      })}
      {...props}>
      {loading ? (
        <ActivityIndicator color={studioTokens.colors.textSecondary} size="small" />
      ) : (
        <>
          {icon}
          <Text className="text-[14px] font-semibold text-foreground">{label}</Text>
        </>
      )}
    </Pressable>
  );
}
