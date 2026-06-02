import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Link2, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { useSurpriseLinkStore } from '@features/surprise-link/store/surprise-link.store';
import { WishColors, WishShadows } from '../constants/design-tokens';

export function ConvertToSurpriseCTA() {
  const currentWish = useAIWishesStore((s) => s.currentWish);
  const updatePersonalization = useSurpriseLinkStore((s) => s.updatePersonalization);
  const addModule = useSurpriseLinkStore((s) => s.addModule);
  const updateModule = useSurpriseLinkStore((s) => s.updateModule);
  const modules = useSurpriseLinkStore((s) => s.modules);
  const setStep = useSurpriseLinkStore((s) => s.setStep);
  const setOccasion = useSurpriseLinkStore((s) => s.setOccasion);

  const handleConvert = () => {
    if (currentWish) {
      updatePersonalization({
        recipientName: currentWish.personName,
        senderName: '',
        relationship: currentWish.relationship,
      });
      setOccasion('birthday');

      const messageMod = modules.find((m) => m.type === 'message');
      if (messageMod && messageMod.type === 'message') {
        updateModule(messageMod.id, { content: currentWish.text });
      } else {
        addModule('message');
        const mod = useSurpriseLinkStore.getState().modules.find((m) => m.type === 'message');
        if (mod && mod.type === 'message') {
          updateModule(mod.id, { content: currentWish.text, title: 'Your Wish' });
        }
      }
    }
    setStep(4);
    router.push({ pathname: '/surprise-link-studio', params: { fromWish: '1' } });
  };

  return (
    <Animated.View entering={FadeInDown.delay(250).duration(400)} className="px-5 mb-6">
      <Pressable
        onPress={handleConvert}
        className="overflow-hidden rounded-2xl"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
          ...WishShadows.md,
          shadowColor: WishColors.secondary,
        })}
        accessibilityRole="button"
        accessibilityLabel="Convert to surprise experience">
        <LinearGradient
          colors={['#FDF2F8', '#FCE7F3', '#FBCFE8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View className="flex-row items-center p-4">
            <View className="h-12 w-12 rounded-2xl bg-secondary/15 items-center justify-center mr-3">
              <Link2 size={22} color={WishColors.secondary} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-[14px] font-bold text-foreground">Convert to Surprise</Text>
                <Sparkles size={13} color="#EC4899" />
              </View>
              <Text className="text-[11px] text-foreground-muted mt-0.5">
                Turn this wish into an interactive surprise experience
              </Text>
            </View>
            <View className="h-9 w-9 rounded-full bg-secondary items-center justify-center ml-2">
              <ChevronRight size={16} color="#FFF" />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
