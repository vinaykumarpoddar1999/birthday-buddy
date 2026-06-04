import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { studioTokens } from '../../constants/studio-tokens';
import type { CardTemplate } from '../../types';
import { TemplateThumbnail } from './TemplateThumbnail';

const THUMB_ASPECT = 5 / 4;

type Props = {
  template: CardTemplate;
  onSelect: (template: CardTemplate) => void;
  width?: number;
  selected?: boolean;
};

export const TemplateCard = memo(function TemplateCard({
  template,
  onSelect,
  width = 155,
  selected = false,
}: Props) {
  const thumbHeight = Math.round(width * THUMB_ASPECT);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withSpring(selected ? 1.03 : 1, { damping: 16, stiffness: 220 }) }],
    }),
    [selected],
  );

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => onSelect(template)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${template.name}`}
        accessibilityState={{ selected }}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}>
        <View
          style={{
            width,
            borderRadius: studioTokens.templateCardRadius,
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? studioTokens.colors.primary : 'rgba(229,231,235,0.9)',
            shadowColor: selected ? studioTokens.colors.primary : '#0F172A',
            shadowOffset: { width: 0, height: selected ? 8 : 4 },
            shadowOpacity: selected ? 0.28 : 0.08,
            shadowRadius: selected ? 14 : 8,
            elevation: selected ? 10 : 4,
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
          }}>
          <View className="relative" style={{ height: thumbHeight }}>
            <TemplateThumbnail template={template} width={width} height={thumbHeight} />

            <LinearGradient
              colors={['transparent', 'rgba(15,23,42,0.55)']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 52,
                justifyContent: 'flex-end',
                paddingHorizontal: 10,
                paddingBottom: 8,
              }}>
              <Text
                className="text-[11px] font-bold text-white"
                numberOfLines={2}
                ellipsizeMode="tail">
                {template.name}
              </Text>
            </LinearGradient>

            {selected ? (
              <View className="absolute top-2 right-2 h-7 w-7 rounded-full bg-primary items-center justify-center shadow-sm">
                <Check size={14} color="#FFF" strokeWidth={3} />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});
