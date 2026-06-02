import React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Briefcase,
  Flame,
  Heart,
  Laugh,
  Rocket,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { WishTone } from '../types';

type ToneItem = {
  id: WishTone;
  label: string;
  Icon: LucideIcon;
  color: string;
};

const TONES: ToneItem[] = [
  { id: 'heartfelt', label: 'Heartfelt', Icon: Heart, color: '#EF4444' },
  { id: 'funny', label: 'Funny', Icon: Laugh, color: '#F59E0B' },
  { id: 'romantic', label: 'Romantic', Icon: Flame, color: '#EC4899' },
  { id: 'motivational', label: 'Motivational', Icon: Rocket, color: '#8B5CF6' },
  { id: 'cute', label: 'Cute', Icon: Star, color: '#F472B6' },
  { id: 'professional', label: 'Professional', Icon: Briefcase, color: '#3B82F6' },
  { id: 'short-sweet', label: 'Short', Icon: Sparkles, color: '#22C55E' },
];

export function ToneSelector() {
  const selectedTone = useAIWishesStore((s) => s.selectedTone);
  const setTone = useAIWishesStore((s) => s.setTone);

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-5 px-5">
      <Text className="text-[14px] font-bold text-foreground mb-3">Choose the tone</Text>
      <View className="flex-row flex-wrap gap-2.5">
        {TONES.map((tone) => {
          const isActive = selectedTone === tone.id;
          const { Icon } = tone;
          return (
            <Pressable
              key={tone.id}
              onPress={() => setTone(tone.id)}
              className={`w-[30%] items-center py-3 rounded-xl border ${
                isActive
                  ? 'border-primary bg-primary/8'
                  : 'border-border/80 bg-surface'
              }`}
              accessibilityRole="button"
              accessibilityLabel={`${tone.label} tone`}
              accessibilityState={{ selected: isActive }}>
              <View
                className="h-9 w-9 rounded-lg items-center justify-center mb-1.5"
                style={{ backgroundColor: isActive ? '#7C3AED' : `${tone.color}14` }}>
                <Icon size={18} color={isActive ? '#FFFFFF' : tone.color} strokeWidth={2} />
              </View>
              <Text
                className={`text-[11px] font-semibold text-center ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}
                numberOfLines={1}>
                {tone.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
