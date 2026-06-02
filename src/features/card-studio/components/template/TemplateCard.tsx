import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import type { CardTemplate } from '../../types';
import { TemplateThumbnail } from './TemplateThumbnail';

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
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withSpring(selected ? 1.02 : 1, { damping: 14 }) }],
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
          style={{ width }}
          className={`rounded-2xl overflow-hidden bg-surface border-2 ${
            selected ? 'border-primary' : 'border-border'
          }`}>
          <View className="relative">
            <TemplateThumbnail template={template} width={width} />
            <View className="absolute bottom-0 left-0 right-0">
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.55)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>
                <View className="px-3 pt-8 pb-2.5">
                  <Text className="text-[12px] font-bold text-white" numberOfLines={1}>
                    {template.name}
                  </Text>
                  <Text className="text-[9px] text-white/75 mt-0.5 capitalize" numberOfLines={1}>
                    {template.category}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});
