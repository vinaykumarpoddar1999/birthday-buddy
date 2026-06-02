import React, { useCallback } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Heart } from 'lucide-react-native';

import { RECIPIENT_TYPES } from '../../data/recipient-types';
import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import type { RecipientType } from '../../types';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';

const NUM_COLUMNS = 3;

export function Step2RecipientScreen() {
  const recipientType = useSurpriseLinkStore((s) => s.recipientType);
  const setRecipientType = useSurpriseLinkStore((s) => s.setRecipientType);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const renderItem = useCallback(
    ({ item, index }: { item: (typeof RECIPIENT_TYPES)[0]; index: number }) => {
      const selected = recipientType === item.id;
      const { Icon } = item;

      return (
        <Animated.View
          entering={FadeInDown.delay(index * 40).springify()}
          className="flex-1 p-1.5"
          style={{ maxWidth: '33.33%' }}>
          <Pressable
            onPress={() => setRecipientType(item.id as RecipientType)}
            accessibilityRole="button"
            accessibilityLabel={`${item.label}${selected ? ', selected' : ''}`}
            className="items-center rounded-2xl overflow-hidden"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}>
            <LinearGradient
              colors={
                selected
                  ? [item.color, `${item.color}CC`]
                  : [`${item.color}08`, `${item.color}15`]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 8,
                borderRadius: 16,
                borderWidth: 2,
                borderColor: selected ? item.color : `${item.color}20`,
                shadowColor: selected ? item.color : 'transparent',
                shadowOffset: { width: 0, height: selected ? 6 : 0 },
                shadowOpacity: selected ? 0.35 : 0,
                shadowRadius: selected ? 12 : 0,
                elevation: selected ? 8 : 0,
              }}>
              {selected && (
                <View
                  className="absolute top-2 right-2 h-5 w-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#FFFFFF' }}>
                  <Check size={12} color={item.color} strokeWidth={3} />
                </View>
              )}

              <View
                className="h-12 w-12 rounded-2xl items-center justify-center mb-2"
                style={{
                  backgroundColor: selected ? 'rgba(255,255,255,0.25)' : `${item.color}18`,
                }}>
                <Icon
                  size={22}
                  color={selected ? '#FFFFFF' : item.color}
                  strokeWidth={2}
                />
              </View>

              <Text
                className="text-[12px] font-bold text-center"
                style={{ color: selected ? '#FFFFFF' : '#1F2937' }}
                numberOfLines={1}>
                {item.label}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      );
    },
    [recipientType, setRecipientType],
  );

  return (
    <StudioStepLayout
      intro={
        <StudioScreenIntro
          title="Who Is This For?"
          subtitle="Select the recipient type to personalize templates, questions, and theme suggestions."
          Icon={Heart}
        />
      }
      footer={<ContinueButton onPress={nextStep} disabled={!recipientType} />}>
      <FlatList
        data={RECIPIENT_TYPES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 16 }}
        initialNumToRender={13}
        showsVerticalScrollIndicator={false}
      />
    </StudioStepLayout>
  );
}
