import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

import { useCardStudioStore } from '../../store/card-studio.store';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'luxury', label: 'Luxury', icon: '👑' },
  { id: 'cute', label: 'Cute', icon: '🧸' },
  { id: 'neon', label: 'Neon', icon: '💜' },
  { id: 'floral', label: 'Floral', icon: '🌸' },
  { id: 'photo', label: 'Photo', icon: '📷' },
  { id: 'romantic', label: 'Romantic', icon: '💕' },
  { id: 'funny', label: 'Funny', icon: '😂' },
  { id: 'minimal', label: 'Minimal', icon: '🤍' },
];

export function CategoryPills() {
  const selected = useCardStudioStore((s) => s.selectedCategory);
  const setCategory = useCardStudioStore((s) => s.setSelectedCategory);

  const handlePress = useCallback(
    (id: string) => setCategory(id),
    [setCategory],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-5 gap-2 pb-1">
      {CATEGORIES.map((cat) => {
        const active = selected === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => handlePress(cat.id)}
            className={`flex-row items-center px-4 py-2.5 rounded-full ${
              active ? 'bg-primary' : 'bg-white border border-gray-200'
            }`}
            accessibilityRole="button">
            <Text className="mr-1.5 text-[13px]">{cat.icon}</Text>
            <Text
              className={`text-[12px] font-semibold ${
                active ? 'text-white' : 'text-foreground-secondary'
              }`}>
              {cat.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
