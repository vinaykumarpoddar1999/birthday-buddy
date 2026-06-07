import React, { useCallback } from 'react';
import { LayoutAnimation, Platform, Pressable, ScrollView, Text, UIManager, View } from 'react-native';

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
    <View className="bg-background pb-2">
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
              <View
                className={`px-4 py-2 rounded-full ${active ? 'bg-primary' : 'bg-surface'}`}
                style={
                  active
                    ? {
                        shadowColor: studioTokens.colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 3,
                      }
                    : undefined
                }>
                <Text
                  className={`text-[12px] font-bold ${active ? 'text-white' : 'text-foreground-secondary'}`}>
                  {cat.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
