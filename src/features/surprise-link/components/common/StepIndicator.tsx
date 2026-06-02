import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  Eye,
  Layers,
  Link2,
  Palette,
  Share2,
  Sparkles,
  User,
  WandSparkles,
} from 'lucide-react-native';

import type { StudioStep } from '../../types';

const STEPS = [
  { num: 1, label: 'Occasion', Icon: Sparkles },
  { num: 2, label: 'Recipient', Icon: User },
  { num: 3, label: 'Template', Icon: Layers },
  { num: 4, label: 'Customize', Icon: WandSparkles },
  { num: 5, label: 'Modules', Icon: Layers },
  { num: 6, label: 'Theme', Icon: Palette },
  { num: 7, label: 'Preview', Icon: Eye },
  { num: 8, label: 'Link', Icon: Link2 },
  { num: 9, label: 'Share', Icon: Share2 },
] as const;

interface StepIndicatorProps {
  currentStep: StudioStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 6 }}
      style={{ flexGrow: 0 }}
      className="border-b border-border/20">
      {STEPS.map((step) => {
        const isActive = step.num === currentStep;
        const isDone = step.num < currentStep;
        const { Icon } = step;

        return (
          <View key={step.num} className="items-center mx-1.5 min-w-[52px]">
            {isDone ? (
              <View className="h-7 w-7 rounded-full overflow-hidden">
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>
                  <Check size={14} color="#FFF" strokeWidth={3} />
                </LinearGradient>
              </View>
            ) : isActive ? (
              <View className="h-7 w-7 rounded-full overflow-hidden">
                <LinearGradient
                  colors={['#7C3AED', '#EC4899']}
                  style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>
                  <Icon size={13} color="#FFF" strokeWidth={2.5} />
                </LinearGradient>
              </View>
            ) : (
              <View className="h-7 w-7 rounded-full bg-gray-100 items-center justify-center">
                <Icon size={12} color="#9CA3AF" />
              </View>
            )}
            <Text
              className={`text-[8px] mt-1 font-bold text-center ${
                isActive ? 'text-primary' : isDone ? 'text-green-600' : 'text-foreground-muted'
              }`}
              numberOfLines={1}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
