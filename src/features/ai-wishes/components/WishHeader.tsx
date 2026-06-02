import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, Sparkles, Star, Wand2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { WishGradients } from '../constants/design-tokens';

type Props = {
  onBack: () => void;
};

export function WishHeader({ onBack }: Props) {
  const credits = useAIWishesStore((s) => s.credits);

  return (
    <LinearGradient
      colors={[...WishGradients.header]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-5 pt-2 pb-5">
      <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-center justify-between">
        <Pressable
          onPress={onBack}
          className="h-11 w-11 rounded-full items-center justify-center bg-white/20 active:bg-white/30"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ChevronLeft size={22} color="#FFFFFF" />
        </Pressable>

        <View className="flex-1 items-center px-2">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 rounded-xl bg-white/15 items-center justify-center">
              <Wand2 size={18} color="#FCD34D" />
            </View>
            <Text className="text-[19px] font-black text-white tracking-tight">
              AI Wish Generator
            </Text>
          </View>
          <Text className="text-[11px] font-semibold text-white/75 mt-1 text-center">
            Personalized messages that feel truly yours
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 rounded-full border border-white/25 bg-white/18 px-3 py-2">
          <Star size={13} color="#FCD34D" fill="#FCD34D" />
          <Text className="text-[15px] font-extrabold text-white">{credits}</Text>
          <Sparkles size={11} color="rgba(255,255,255,0.7)" />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
