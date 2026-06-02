import React, { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Check,
  Eye,
  LayoutGrid,
  Link2,
  Layers,
  Palette,
  Share2,
  Sparkles,
  User,
  WandSparkles,
} from 'lucide-react-native';

import type { StudioStep } from '../../types';
import { SURPRISE_STUDIO } from '../../constants/surprise-studio.tokens';

const STEPS = [
  { num: 1, label: 'Occasion', Icon: Sparkles },
  { num: 2, label: 'Recipient', Icon: User },
  { num: 3, label: 'Template', Icon: Layers },
  { num: 4, label: 'Customize', Icon: WandSparkles },
  { num: 5, label: 'Modules', Icon: LayoutGrid },
  { num: 6, label: 'Theme', Icon: Palette },
  { num: 7, label: 'Preview', Icon: Eye },
  { num: 8, label: 'Link', Icon: Link2 },
  { num: 9, label: 'Share', Icon: Share2 },
] as const;

interface StepIndicatorProps {
  currentStep: StudioStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = Math.max(0, currentStep - 1);
    scrollRef.current?.scrollTo({ x: index * 58, animated: true });
  }, [currentStep]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
      style={{ flexGrow: 0 }}
      className="border-b border-border/20"
      accessibilityRole="tablist"
      accessibilityLabel={`Step ${currentStep} of 9`}>
      {STEPS.map((step) => {
        const isActive = step.num === currentStep;
        const isDone = step.num < currentStep;
        const { Icon } = step;

        return (
          <View
            key={step.num}
            className="items-center mx-1.5 min-w-[54px]"
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${step.label}, step ${step.num} of 9${isDone ? ', completed' : isActive ? ', current' : ''}`}>
            {isDone ? (
              <View className="h-8 w-8 rounded-full overflow-hidden">
                <LinearGradient
                  colors={['#22C55E', '#16A34A']}
                  className="h-8 w-8 items-center justify-center">
                  <Check size={14} color="#FFF" strokeWidth={3} />
                </LinearGradient>
              </View>
            ) : isActive ? (
              <View className="h-8 w-8 rounded-full overflow-hidden">
                <LinearGradient
                  colors={[...SURPRISE_STUDIO.gradient.cta]}
                  className="h-8 w-8 items-center justify-center">
                  <Icon size={14} color="#FFF" strokeWidth={2.5} />
                </LinearGradient>
              </View>
            ) : (
              <View className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
                <Icon size={13} color="#9CA3AF" />
              </View>
            )}
            <Text
              className={`text-[9px] mt-1.5 font-bold text-center max-w-[54px] ${
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
