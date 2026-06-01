import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Gift, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

import { useAIWishesStore } from '../store/ai-wishes.store';
import { useCardStudioStore } from '@features/card-studio/store/card-studio.store';

export function CreateCardCTA() {
  const currentWish = useAIWishesStore((s) => s.currentWish);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);

  const handleCreateCard = () => {
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
    <View className="px-5 mb-6">
      <Pressable
        onPress={handleCreateCard}
        className="overflow-hidden rounded-2xl"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 5,
        })}
        accessibilityRole="button">
        <LinearGradient
          colors={['#F5F3FF', '#EDE9FE', '#E9D5FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View className="flex-row items-center p-4">
            <View className="h-12 w-12 rounded-2xl bg-primary/15 items-center justify-center mr-3">
              <Gift size={22} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1">
                <Text className="text-[14px] font-bold text-foreground">
                  Make it extra special!
                </Text>
                <Sparkles size={13} color="#7C3AED" />
              </View>
              <Text className="text-[11px] text-foreground-muted mt-0.5">
                Create an interactive birthday card with photos, music & more
              </Text>
            </View>
            <View className="h-9 w-9 rounded-full bg-primary items-center justify-center ml-2">
              <ChevronRight size={16} color="#FFF" />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
