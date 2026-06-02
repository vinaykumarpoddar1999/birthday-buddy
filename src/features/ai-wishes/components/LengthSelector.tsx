import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FileText, Type, Zap, type LucideIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { WishLength } from '../types';

type LengthItem = {
  id: WishLength;
  label: string;
  Icon: LucideIcon;
};

const LENGTHS: LengthItem[] = [
  { id: 'short', label: 'Short', Icon: Zap },
  { id: 'medium', label: 'Medium', Icon: Type },
  { id: 'long', label: 'Long', Icon: FileText },
];

export function LengthSelector() {
  const selectedLength = useAIWishesStore((s) => s.selectedLength);
  const setLength = useAIWishesStore((s) => s.setLength);

  return (
    <Animated.View entering={FadeInDown.delay(150).duration(400)} className="mb-5 px-5">
      <Text className="text-[14px] font-bold text-foreground mb-3">Choose length</Text>
      <View className="flex-row gap-2.5">
        {LENGTHS.map((opt) => {
          const isActive = selectedLength === opt.id;
          const { Icon } = opt;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setLength(opt.id)}
              className={`flex-1 flex-row items-center justify-center gap-2 py-3.5 rounded-xl border ${
                isActive
                  ? 'border-primary bg-primary/8'
                  : 'border-border/80 bg-surface'
              }`}
              accessibilityRole="button"
              accessibilityLabel={`${opt.label} length`}
              accessibilityState={{ selected: isActive }}>
              <Icon size={16} color={isActive ? '#7C3AED' : '#6B7280'} strokeWidth={2} />
              <Text
                className={`text-[13px] font-semibold ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
