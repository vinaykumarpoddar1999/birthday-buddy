import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share2 } from 'lucide-react-native';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardRenderer } from '../components/preview/CardRenderer';

const SCREEN_W = Dimensions.get('window').width;
const PREVIEW_SCALE = Math.min((SCREEN_W - 48) / 340, 0.88);

export function Step3PreviewScreen() {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const personalization = useCardStudioStore((s) => s.personalization);
  const elements = useCardStudioStore((s) => s.elements);
  const nextStep = useCardStudioStore((s) => s.nextStep);
  const prevStep = useCardStudioStore((s) => s.prevStep);

  if (!template) return null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28">
        {/* Card Preview */}
        <View className="items-center py-6 bg-gray-50/50">
          <View
            className="shadow-xl"
            style={{
              width: 340 * PREVIEW_SCALE,
              height: 480 * PREVIEW_SCALE,
              borderRadius: 20,
              overflow: 'hidden',
            }}>
            <CardRenderer
              template={template}
              personalization={personalization}
              elements={elements}
              scale={PREVIEW_SCALE}
            />
          </View>
        </View>

        {/* Card details */}
        <View className="px-6 py-5">
          <Text className="text-heading font-bold text-foreground text-center">
            Your card is ready! ✨
          </Text>
          <Text className="text-caption text-foreground-secondary text-center mt-2">
            Review it and continue to download or share
          </Text>

          <View className="bg-white rounded-2xl p-4 mt-5 border border-gray-100">
            <DetailRow label="Template" value={template.name} />
            <DetailRow label="Recipient" value={personalization.recipientName || '—'} />
            <DetailRow label="From" value={personalization.senderName || '—'} />
            <DetailRow label="Format" value="PNG · High Quality" isLast />
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4">
        <View className="flex-row gap-3">
          <Pressable
            onPress={prevStep}
            className="flex-row items-center justify-center bg-gray-100 rounded-2xl px-5 py-4 gap-1"
            accessibilityRole="button">
            <ChevronLeft size={16} color="#374151" />
            <Text className="text-[13px] font-semibold text-foreground">Edit</Text>
          </Pressable>

          <Pressable
            onPress={nextStep}
            className="flex-1 overflow-hidden rounded-2xl"
            accessibilityRole="button">
            <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center justify-center py-4 gap-2">
                <Share2 size={16} color="#FFF" />
                <Text className="text-[14px] font-bold text-white">Share & Download</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between py-2.5 ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <Text className="text-[12px] text-foreground-secondary">{label}</Text>
      <Text className="text-[12px] font-semibold text-foreground">{value}</Text>
    </View>
  );
}
