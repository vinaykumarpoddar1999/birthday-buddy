import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { ToneOption, WishTone } from '../types';
import { WishSectionHeader } from './WishSectionHeader';
import { WishShadows } from '../constants/design-tokens';

type ToneWithIcon = ToneOption & {
  Icon: LucideIcon;
  gradient: [string, string];
};

const TONES: ToneWithIcon[] = [
  {
    id: 'heartfelt', label: 'Heartfelt', Icon: Heart,
    description: 'Warm & emotional', color: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
  },
  {
    id: 'funny', label: 'Funny', Icon: Laugh,
    description: 'Witty & playful', color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    id: 'romantic', label: 'Romantic', Icon: Flame,
    description: 'Love-filled', color: '#EC4899',
    gradient: ['#EC4899', '#DB2777'],
  },
  {
    id: 'motivational', label: 'Motivational', Icon: Rocket,
    description: 'Inspiring words', color: '#8B5CF6',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: 'cute', label: 'Cute', Icon: Star,
    description: 'Sweet & adorable', color: '#F472B6',
    gradient: ['#F472B6', '#EC4899'],
  },
  {
    id: 'professional', label: 'Professional', Icon: Briefcase,
    description: 'Formal & polished', color: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB'],
  },
  {
    id: 'short-sweet', label: 'Short & Sweet', Icon: Sparkles,
    description: 'Brief & beautiful', color: '#22C55E',
    gradient: ['#22C55E', '#16A34A'],
  },
];

export function ToneSelector() {
  const selectedTone = useAIWishesStore((s) => s.selectedTone);
  const setTone = useAIWishesStore((s) => s.setTone);

  return (
    <Animated.View entering={FadeInDown.delay(150).duration(400)} className="mb-5">
      <WishSectionHeader step={1} title="Choose the tone" subtitle="Match the vibe — heartfelt, funny, romantic & more" Icon={Sparkles} />

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
                transform: [{ scale: pressed ? 0.93 : 1 }],
              })}
              accessibilityRole="button"
              accessibilityLabel={`${tone.label} tone`}>
              {isActive ? (
                <View
                  className="rounded-2xl overflow-hidden"
                  style={{
                    width: 92,
                    ...WishShadows.md,
                    shadowColor: tone.color,
                    shadowOpacity: 0.35,
                  }}>
                  <LinearGradient
                    colors={tone.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}>
                    <View className="items-center py-3 px-2">
                      <View className="h-10 w-10 rounded-xl bg-white/20 items-center justify-center mb-1.5">
                        <Icon size={20} color="#FFFFFF" strokeWidth={2} />
                      </View>
                      <Text className="text-[11px] font-bold text-white" numberOfLines={1}>
                        {tone.label}
                      </Text>
                      <Text className="text-[8px] text-white/70 mt-0.5" numberOfLines={1}>
                        {tone.description}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View
                  className="items-center py-3 px-2 rounded-2xl bg-surface border border-border/80"
                  style={{ width: 92, ...WishShadows.sm }}>
                  <View
                    className="h-10 w-10 rounded-xl items-center justify-center mb-1.5"
                    style={{ backgroundColor: `${tone.color}12` }}>
                    <Icon size={20} color={tone.color} strokeWidth={2} />
                  </View>
                  <Text className="text-[11px] font-semibold text-foreground" numberOfLines={1}>
                    {tone.label}
                  </Text>
                  <Text className="text-[8px] text-foreground-muted mt-0.5" numberOfLines={1}>
                    {tone.description}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
