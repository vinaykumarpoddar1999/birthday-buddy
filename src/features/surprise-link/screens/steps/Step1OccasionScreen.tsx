import React, { useCallback } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { OCCASIONS } from '../../data/occasions';
import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import type { Occasion } from '../../types';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';
import { Sparkles } from 'lucide-react-native';

const CARD_W = (Dimensions.get('window').width - 52) / 2;

export function Step1OccasionScreen() {
  const occasion = useSurpriseLinkStore((s) => s.occasion);
  const setOccasion = useSurpriseLinkStore((s) => s.setOccasion);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof OCCASIONS)[0]; index: number }) => {
      const selected = occasion === item.id;
      const { Icon } = item;
      return (
        <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
          <Pressable
            onPress={() => setOccasion(item.id as Occasion)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={{ width: CARD_W }}
            className="mb-3">
            <LinearGradient
              colors={selected ? [...item.colors, item.colors[1]] : item.colors}
              style={{
                borderRadius: 16,
                padding: 16,
                minHeight: 128,
                borderWidth: 2,
                borderColor: selected ? '#FFFFFF' : 'transparent',
                shadowColor: item.accentColor,
                shadowOffset: { width: 0, height: selected ? 8 : 4 },
                shadowOpacity: selected ? 0.35 : 0.1,
                shadowRadius: selected ? 14 : 10,
                elevation: selected ? 8 : 2,
                transform: [{ scale: selected ? 1.02 : 1 }],
              }}>
              {selected && (
                <View className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white items-center justify-center">
                  <Text className="text-primary text-[12px] font-black">✓</Text>
                </View>
              )}
              <View
                className="h-10 w-10 rounded-xl items-center justify-center mb-2"
                style={{ backgroundColor: item.accentColor }}>
                <Icon size={20} color="#FFF" />
              </View>
              <Text className="text-[20px] mb-1">{item.emoji}</Text>
              <Text className="text-[14px] font-bold text-foreground">{item.label}</Text>
              <Text className="text-[10px] text-foreground-secondary mt-0.5">{item.subtitle}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      );
    },
    [occasion, setOccasion],
  );

  return (
    <StudioStepLayout
      intro={
        <StudioScreenIntro
          title="Choose Occasion"
          subtitle="What moment are you celebrating? Each occasion unlocks tailored themes and questions."
          Icon={Sparkles}
        />
      }
      footer={<ContinueButton onPress={nextStep} disabled={!occasion} />}>
      <FlatList
        data={OCCASIONS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={renderItem}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
    </StudioStepLayout>
  );
}
