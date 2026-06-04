import React, { useCallback } from 'react';
import { LayoutAnimation, Platform, Pressable, ScrollView, Text, UIManager, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useCardStudioStore } from '../../store/card-studio.store';
import { TEMPLATE_CATEGORIES, type TemplateCategoryFilter } from '../../types';
import { studioTokens } from '../../constants/studio-tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function CategoryPills() {
  const selected = useCardStudioStore((s) => s.selectedCategory);
  const setCategory = useCardStudioStore((s) => s.setSelectedCategory);

  const handlePress = useCallback(
    (id: TemplateCategoryFilter) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCategory(id);
    },
    [setCategory],
  );

  return (
    <View className="bg-background border-b border-border/50 pb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingTop: 4 }}>
        {TEMPLATE_CATEGORIES.map((cat) => {
          const active = selected === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => handlePress(cat.id)}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${cat.label}`}
              accessibilityState={{ selected: active }}
              style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}>
              {active ? (
                <View className="rounded-full overflow-hidden">
                  <LinearGradient
                    colors={[...studioTokens.colors.gradientPrimary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <View className="px-4 py-2">
                      <Text className="text-[12px] font-bold text-white">{cat.label}</Text>
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View className="px-4 py-2 rounded-full bg-surface border border-border">
                  <Text className="text-[12px] font-semibold text-foreground-secondary">
                    {cat.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
