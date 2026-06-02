import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Cake, Heart, Palette } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { useCardStudioStore } from '@features/card-studio/store/card-studio.store';
import { templateRegistry } from '@features/card-studio/templates';

type Props = {
  personName: string;
};

export function WishCardPreview({ personName }: Props) {
  const currentWish = useAIWishesStore((s) => s.currentWish);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);

  const templates = templateRegistry.getAllTemplates();
  const previewTemplate = templates[0];

  if (!currentWish || !previewTemplate) return null;

  const handleChangeCard = () => {
    if (currentWish) {
      updatePersonalization({
        recipientName: currentWish.personName,
        message: currentWish.text,
        relationship: currentWish.relationship,
      });
    }
    router.push('/card-studio');
  };

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-5 mb-5">
      <View className="flex-row items-center gap-2 mb-3">
        <Palette size={16} color="#7C3AED" />
        <Text className="text-[14px] font-bold text-foreground">Card Preview</Text>
      </View>

      <View
        className="overflow-hidden rounded-2xl border border-gray-100"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
        }}>
        <View className="flex-row">
          <View className="flex-1 p-4 bg-white">
            <View className="flex-row items-center gap-1.5 mb-2">
              <Heart size={12} color="#EC4899" fill="#EC4899" strokeWidth={1.75} />
              <Text className="text-[12px] font-bold text-foreground">
                Happy Birthday {personName}!
              </Text>
            </View>
            <Text className="text-[10px] text-foreground-secondary leading-4" numberOfLines={6}>
              {currentWish.text}
            </Text>
          </View>

          <View className="w-[120px] overflow-hidden">
            <LinearGradient
              colors={
                previewTemplate.background.type === 'gradient'
                  ? (previewTemplate.background.value as string[]) as [string, string, ...string[]]
                  : ['#7C3AED', '#5B21B6']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, minHeight: 140 }}>
              <View className="flex-1 items-center justify-center p-3">
                <Text className="text-[10px] font-bold text-white text-center">
                  Happy{'\n'}Birthday
                </Text>
                <Text className="text-[14px] font-bold text-white/90 text-center mt-1" numberOfLines={1}>
                  {personName}
                </Text>
                <Cake size={20} color="#FFFFFF" strokeWidth={1.75} style={{ marginTop: 4 }} />
              </View>
            </LinearGradient>

            <Pressable
              onPress={handleChangeCard}
              className="flex-row items-center justify-center bg-primary/10 py-2.5 gap-1 active:bg-primary/20"
              accessibilityRole="button"
              accessibilityLabel="Change card template">
              <Text className="text-[9px] font-bold text-primary">Change Card</Text>
              <ArrowRight size={10} color="#7C3AED" />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
