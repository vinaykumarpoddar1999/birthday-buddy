import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Download, Eye, LayoutTemplate, Palette } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { studioTokens } from '../../constants/studio-tokens';

const STEPS = [
  { num: 1, label: 'Template', Icon: LayoutTemplate },
  { num: 2, label: 'Personalize', Icon: Palette },
  { num: 3, label: 'Preview', Icon: Eye },
  { num: 4, label: 'Share', Icon: Download },
] as const;

type Props = { currentStep: 1 | 2 | 3 | 4 };

function stepProgressPercent(step: 1 | 2 | 3 | 4): number {
  if (STEPS.length <= 1) return 100;
  return ((step - 0.5) / STEPS.length) * 100;
}

function StepCircle({
  step,
  currentStep,
}: {
  step: (typeof STEPS)[number];
  currentStep: 1 | 2 | 3 | 4;
}) {
  const isActive = step.num === currentStep;
  const isDone = step.num < currentStep;
  const { Icon } = step;
  const scale = useSharedValue(isActive ? 1.08 : 1);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.08 : 1, { damping: 14, stiffness: 180 });
  }, [isActive, scale]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={circleStyle} className="h-6 w-6 rounded-full items-center justify-center overflow-hidden">
      {isDone ? (
        <LinearGradient
          colors={[...studioTokens.colors.gradientDone]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}>
          <Check size={12} color="#FFF" strokeWidth={3} />
        </LinearGradient>
      ) : isActive ? (
        <LinearGradient
          colors={[...studioTokens.colors.gradientPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 24,
            height: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
          }}>
          <Icon size={12} color="#FFF" strokeWidth={2.5} />
        </LinearGradient>
      ) : (
        <View className="h-6 w-6 rounded-full items-center justify-center bg-gray-100 border border-border">
          <Icon size={12} color={studioTokens.colors.textMuted} strokeWidth={2} />
        </View>
      )}
    </Animated.View>
  );
}

export function StepIndicator({ currentStep }: Props) {
  const progress = useSharedValue(stepProgressPercent(currentStep));

  useEffect(() => {
    progress.value = withSpring(stepProgressPercent(currentStep), {
      damping: 16,
      stiffness: 120,
    });
  }, [currentStep, progress]);

  const trackFillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View className="px-5 py-2">
      <View className="h-[3px] rounded-full bg-gray-100 overflow-hidden mb-3">
        <Animated.View style={[trackFillStyle, { height: 3, borderRadius: 2, overflow: 'hidden' }]}>
          <LinearGradient
            colors={[...studioTokens.colors.gradientProgress]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '100%', height: 3 }}
          />
        </Animated.View>
      </View>

      <View className="flex-row items-start justify-between">
        {STEPS.map((step, index) => {
          const isActive = step.num === currentStep;
          const isDone = step.num < currentStep;
          const segmentDone = step.num < currentStep;

          return (
            <React.Fragment key={step.num}>
              {index > 0 ? (
                <View
                  className={`flex-1 h-[2px] rounded-full mt-3 mx-0.5 ${
                    segmentDone ? 'bg-primary/35' : 'bg-border'
                  }`}
                />
              ) : null}
              <View className="items-center min-w-[56px]">
                <StepCircle step={step} currentStep={currentStep} />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className={`text-[9px] mt-1 font-semibold text-center ${
                    isActive
                      ? 'text-primary'
                      : isDone
                        ? 'text-green-600'
                        : 'text-foreground-muted'
                  }`}>
                  {step.label}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
