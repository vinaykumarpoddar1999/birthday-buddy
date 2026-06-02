import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useCardStudioStore } from '../../store/card-studio.store';
import { TEMPLATE_CATEGORIES } from '../../types';

export function CategoryPills() {
  const selected = useCardStudioStore((s) => s.selectedCategory);
  const setCategory = useCardStudioStore((s) => s.setSelectedCategory);

  const handlePress = useCallback((id: string) => setCategory(id), [setCategory]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 4 }}>
      {TEMPLATE_CATEGORIES.map((cat) => {
        const active = selected === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => handlePress(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat.label}`}
            accessibilityState={{ selected: active }}>
            {active ? (
              <View className="rounded-full overflow-hidden">
                <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <View className="px-4 py-2.5">
                    <Text className="text-[13px] font-bold text-white">{cat.label}</Text>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View className="px-4 py-2.5 rounded-full bg-surface border border-border">
                <Text className="text-[13px] font-semibold text-foreground-secondary">{cat.label}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
