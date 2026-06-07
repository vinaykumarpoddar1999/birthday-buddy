import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight, RotateCcw, RotateCw, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { studioTokens } from '../../constants/studio-tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onBack: () => void;
  title?: string;
  titleIcon?: React.ReactNode;
  alignTitle?: 'center' | 'left';
  rightElement?: React.ReactNode;
  showUndoRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  primaryAction?: { label: string; onPress: () => void };
  hideTitleIcon?: boolean;
};

function HeaderIconButton({
  onPress,
  disabled,
  label,
  children,
}: {
  onPress?: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(0.92, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        animStyle,
        {
          width: studioTokens.touchMin,
          height: studioTokens.touchMin,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      className={`rounded-full border ${
        disabled ? 'bg-gray-50 border-transparent' : 'bg-surface border-border/80'
      }`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}>
      {children}
    </AnimatedPressable>
  );
}

function HeaderPrimaryAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.96 : 1 }] })}
      className="overflow-hidden rounded-xl">
      <LinearGradient
        colors={[...studioTokens.colors.gradientPrimary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View
          className="flex-row items-center justify-center gap-1 px-3"
          style={{ minHeight: 36 }}>
          <Text className="text-[13px] font-bold text-white">{label}</Text>
          <ChevronRight size={14} color="#FFF" strokeWidth={2.5} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export function CardStudioHeader({
  onBack,
  title = 'Create Card',
  titleIcon,
  alignTitle = 'center',
  rightElement,
  showUndoRedo,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  primaryAction,
  hideTitleIcon = false,
}: Props) {
  const isLeftAligned = alignTitle === 'left';
  const resolvedTitleIcon =
    titleIcon ??
    (!hideTitleIcon ? (
      <View className="h-7 w-7 rounded-lg bg-primary/10 items-center justify-center">
        <Sparkles size={15} color={studioTokens.colors.primary} strokeWidth={2.2} />
      </View>
    ) : null);

  return (
    <View className="px-5 pt-2 pb-3 border-b border-border/60 bg-background">
      <Animated.View entering={FadeInDown.duration(350)} className="flex-row items-center min-h-[44px]">
        <View style={{ width: studioTokens.touchMin, zIndex: 1 }}>
          <HeaderIconButton onPress={onBack} label="Go back">
            <ChevronLeft size={22} color={studioTokens.colors.primary} />
          </HeaderIconButton>
        </View>

        {isLeftAligned ? (
          <View className="flex-1 flex-row items-center gap-2 px-2" style={{ zIndex: 0 }}>
            {resolvedTitleIcon}
            <Text
              className="text-[17px] font-bold text-foreground tracking-tight"
              numberOfLines={1}
              ellipsizeMode="tail">
              {title}
            </Text>
          </View>
        ) : (
          <View
            className="absolute left-0 right-0 flex-row items-center justify-center gap-2 px-14 pointer-events-none"
            style={{ zIndex: 0 }}>
            {resolvedTitleIcon}
            <Text
              className="text-[17px] font-bold text-foreground tracking-tight"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ maxWidth: '70%' }}>
              {title}
            </Text>
          </View>
        )}

        <View
          style={{
            marginLeft: isLeftAligned ? 0 : 'auto',
            zIndex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          {showUndoRedo ? (
            <>
              <HeaderIconButton onPress={onUndo} disabled={!canUndo} label="Undo">
                <RotateCcw size={15} color={canUndo ? '#374151' : '#D1D5DB'} />
              </HeaderIconButton>
              <HeaderIconButton onPress={onRedo} disabled={!canRedo} label="Redo">
                <RotateCw size={15} color={canRedo ? '#374151' : '#D1D5DB'} />
              </HeaderIconButton>
            </>
          ) : null}
          {primaryAction ? (
            <HeaderPrimaryAction label={primaryAction.label} onPress={primaryAction.onPress} />
          ) : (
            rightElement ?? null
          )}
        </View>
      </Animated.View>
    </View>
  );
}
