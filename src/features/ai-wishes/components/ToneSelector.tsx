import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Briefcase,
  Heart,
  Laugh,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react-native';

import { useAIWishesStore } from '../store/ai-wishes.store';
import type { ToneOption, WishTone } from '../types';

type ToneWithIcon = ToneOption & { Icon: LucideIcon };

const TONES: ToneWithIcon[] = [
  { id: 'heartfelt', label: 'Heartfelt', Icon: Heart, description: 'Warm & emotional', color: '#EF4444' },
  { id: 'funny', label: 'Funny', Icon: Laugh, description: 'Witty & playful', color: '#F59E0B' },
  { id: 'romantic', label: 'Romantic', Icon: Heart, description: 'Love-filled', color: '#EC4899' },
  { id: 'motivational', label: 'Motivational', Icon: Star, description: 'Inspiring words', color: '#8B5CF6' },
  { id: 'cute', label: 'Cute', Icon: Heart, description: 'Sweet & adorable', color: '#F472B6' },
  { id: 'professional', label: 'Professional', Icon: Briefcase, description: 'Formal & polished', color: '#3B82F6' },
  { id: 'short-sweet', label: 'Short & Sweet', Icon: Sparkles, description: 'Brief & beautiful', color: '#22C55E' },
];

export function ToneSelector() {
  const selectedTone = useAIWishesStore((s) => s.selectedTone);
  const setTone = useAIWishesStore((s) => s.setTone);

  return (
    <View className="mb-5">
      <View className="px-5 mb-3">
        <Text className="text-[14px] font-bold text-foreground">1. Choose the tone</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-2.5"
        decelerationRate="fast">
        {TONES.map((tone) => {
          const isActive = selectedTone === tone.id;
          const { Icon } = tone;
          return (
            <Pressable
              key={tone.id}
              onPress={() => setTone(tone.id as WishTone)}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
              accessibilityRole="button"
              accessibilityLabel={`${tone.label} tone`}>
              {isActive ? (
                <View
                  className="rounded-2xl overflow-hidden"
                  style={{
                    width: 82,
                    shadowColor: tone.color,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}>
                  <LinearGradient
                    colors={['#7C3AED', '#5B21B6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}>
                    <View className="items-center py-3 px-1.5">
                      <Icon size={26} color="#FFFFFF" strokeWidth={1.75} />
                      <Text className="text-[11px] font-bold text-white mt-1.5" numberOfLines={1}>
                        {tone.label}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View
                  className="items-center py-3 px-1.5 rounded-2xl bg-white border border-gray-100"
                  style={{
                    width: 82,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 1,
                  }}>
                  <Icon size={26} color={tone.color} strokeWidth={1.75} />
                  <Text className="text-[11px] font-semibold text-foreground-secondary mt-1.5" numberOfLines={1}>
                    {tone.label}
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
