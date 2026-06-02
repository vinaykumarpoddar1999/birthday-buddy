import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, Wand2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = {
  onBack: () => void;
};

export function WishHeader({ onBack }: Props) {
  return (
    <View className="px-5 pt-2 pb-4 border-b border-border/60 bg-background">
      <Animated.View entering={FadeInDown.duration(400)} className="flex-row items-center">
        <Pressable
          onPress={onBack}
          className="h-10 w-10 rounded-full items-center justify-center bg-surface border border-border/80 active:bg-primary/5"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ChevronLeft size={22} color="#7C3AED" />
        </Pressable>

        <View className="flex-1 flex-row items-center justify-center gap-2 pr-10">
          <View className="h-8 w-8 rounded-xl bg-primary/10 items-center justify-center">
            <Wand2 size={17} color="#7C3AED" strokeWidth={2.2} />
          </View>
          <Text className="text-[18px] font-bold text-foreground tracking-tight">
            Wish Generator
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
