import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, Sparkles, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAIWishesStore } from '../store/ai-wishes.store';

type Props = {
  onBack: () => void;
};

export function WishHeader({ onBack }: Props) {
  const credits = useAIWishesStore((s) => s.credits);

  return (
    <View className="flex-row items-center justify-between px-5 py-2.5">
      <Pressable
        onPress={onBack}
        className="h-10 w-10 rounded-full bg-white items-center justify-center border border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 3,
          elevation: 2,
        }}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <ChevronLeft size={20} color="#374151" />
      </Pressable>

      <View className="items-center">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[17px] font-bold text-foreground tracking-tight">
            AI Wish Generator
          </Text>
          <Sparkles size={16} color="#7C3AED" />
        </View>
        <Text className="text-[10px] text-foreground-muted mt-0.5">
          Create the perfect wish for your special one
        </Text>
      </View>

      <View className="overflow-hidden rounded-full">
        <LinearGradient
          colors={['#F5F3FF', '#EDE9FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View className="flex-row items-center px-3 py-1.5 gap-1">
            <Star size={12} color="#7C3AED" fill="#7C3AED" />
            <Text className="text-[12px] font-bold text-primary">{credits}</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
