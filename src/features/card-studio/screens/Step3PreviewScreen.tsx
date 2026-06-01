import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share2, Check, FileText, User, Send } from 'lucide-react-native';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardRenderer } from '../components/preview/CardRenderer';

const SCREEN_W = Dimensions.get('window').width;
const PREVIEW_SCALE = Math.min((SCREEN_W - 48) / 340, 0.88);

export function Step3PreviewScreen() {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  const personalization = useCardStudioStore((s) => s.personalization);
  const elements = useCardStudioStore((s) => s.elements);
  const customBackground = useCardStudioStore((s) => s.customBackground);
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
        <View className="items-center py-6">
          <View
            className="rounded-3xl overflow-hidden"
            style={{
              width: 340 * PREVIEW_SCALE + 8,
              height: 480 * PREVIEW_SCALE + 8,
              padding: 4,
              backgroundColor: '#F3F0FF',
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 30,
              elevation: 10,
            }}>
            <View
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
                customBackground={customBackground}
              />
            </View>
          </View>
        </View>

        {/* Ready message */}
        <View className="px-6 py-2">
          <View className="items-center mb-5">
            <View className="h-12 w-12 rounded-2xl bg-green-50 items-center justify-center mb-3">
              <Check size={22} color="#22C55E" strokeWidth={3} />
            </View>
            <Text className="text-[20px] font-bold text-foreground text-center">
              Looking great!
            </Text>
            <Text className="text-[13px] text-foreground-muted text-center mt-1.5 leading-5">
              Your card is ready to share with{' '}
              {personalization.recipientName || 'your loved one'}
            </Text>
          </View>

          {/* Card details */}
          <View
            className="bg-white rounded-2xl overflow-hidden border border-gray-100"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <DetailRow
              icon={<FileText size={14} color="#7C3AED" />}
              label="Template"
              value={template.name}
            />
            <DetailRow
              icon={<User size={14} color="#EC4899" />}
              label="To"
              value={personalization.recipientName || '—'}
            />
            <DetailRow
              icon={<Send size={14} color="#22C55E" />}
              label="From"
              value={personalization.senderName || '—'}
            />
            <DetailRow
              icon={<View className="h-3.5 w-3.5 rounded-sm bg-primary/20" />}
              label="Quality"
              value="PNG · High Quality"
              isLast
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-background/95">
        <View className="flex-row gap-3">
          <Pressable
            onPress={prevStep}
            className="flex-row items-center justify-center bg-white rounded-2xl px-5 py-4 gap-1.5 border border-gray-100"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.97 : 1 }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            })}
            accessibilityRole="button">
            <ChevronLeft size={16} color="#374151" />
            <Text className="text-[14px] font-semibold text-foreground">Edit</Text>
          </Pressable>

          <Pressable
            onPress={nextStep}
            className="flex-1 overflow-hidden rounded-2xl"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            })}
            accessibilityRole="button">
            <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center justify-center py-4 gap-2">
                <Share2 size={17} color="#FFF" />
                <Text className="text-[15px] font-bold text-white">Share & Download</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View className={`flex-row items-center px-4 py-3.5 ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <View className="h-8 w-8 rounded-lg bg-gray-50 items-center justify-center mr-3">
        {icon}
      </View>
      <Text className="text-[12px] text-foreground-muted flex-1">{label}</Text>
      <Text className="text-[13px] font-semibold text-foreground">{value}</Text>
    </View>
  );
}
