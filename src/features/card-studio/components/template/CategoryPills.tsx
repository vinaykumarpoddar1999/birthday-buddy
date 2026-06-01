import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Baby,
  Camera,
  Circle,
  Flame,
  Flower2,
  Heart,
  Laugh,
  Crown,
  Rainbow,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';

type Category = { id: string; label: string; Icon: LucideIcon };

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', Icon: Sparkles },
  { id: 'trending', label: 'Trending', Icon: Flame },
  { id: 'luxury', label: 'Luxury', Icon: Crown },
  { id: 'cute', label: 'Cute', Icon: Baby },
  { id: 'neon', label: 'Neon', Icon: Heart },
  { id: 'floral', label: 'Floral', Icon: Flower2 },
  { id: 'photo', label: 'Photo', Icon: Camera },
  { id: 'romantic', label: 'Romantic', Icon: Heart },
  { id: 'funny', label: 'Funny', Icon: Laugh },
  { id: 'minimal', label: 'Minimal', Icon: Circle },
  { id: 'modern', label: 'Modern', Icon: Zap },
  { id: 'gradient', label: 'Gradient', Icon: Rainbow },
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
      contentContainerClassName="px-5 gap-2.5 pb-1">
      {CATEGORIES.map((cat) => {
        const active = selected === cat.id;
        const { Icon } = cat;
        return (
          <Pressable
            key={cat.id}
            onPress={() => handlePress(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${cat.label}`}>
            {active ? (
              <View className="rounded-full overflow-hidden" style={{
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 4,
              }}>
                <LinearGradient
                  colors={['#7C3AED', '#5B21B6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <View className="flex-row items-center px-4.5 py-2.5 gap-1.5">
                    <Icon size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text className="text-[13px] font-bold text-white">{cat.label}</Text>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View
                className="flex-row items-center px-4 py-2.5 rounded-full bg-white border border-gray-100 gap-1.5"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 3,
                  elevation: 1,
                }}>
                <Icon size={14} color="#6B7280" strokeWidth={2} />
                <Text className="text-[13px] font-semibold text-foreground-secondary">{cat.label}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
