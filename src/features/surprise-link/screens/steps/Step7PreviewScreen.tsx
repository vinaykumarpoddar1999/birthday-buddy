import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import {
  TriangleAlert,
  CircleCheck,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react-native';

import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import { validateExperience } from '../../utils/validation';
import { ExperiencePreview } from '../../components/viewer/ExperiencePreview';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';
import type { PreviewMode } from '../../types';

const PREVIEW_MODES: {
  id: PreviewMode;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  widthPct: number;
}[] = [
  { id: 'mobile', label: 'Mobile', Icon: Smartphone, widthPct: 100 },
  { id: 'tablet', label: 'Tablet', Icon: Tablet, widthPct: 85 },
  { id: 'desktop', label: 'Desktop', Icon: Monitor, widthPct: 70 },
];

export function Step7PreviewScreen() {
  const toExperience = useSurpriseLinkStore((s) => s.toExperience);
  const previewMode = useSurpriseLinkStore((s) => s.previewMode);
  const setPreviewMode = useSurpriseLinkStore((s) => s.setPreviewMode);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const experience = useMemo(() => {
    const built = toExperience();
    return {
      ...built,
      modules: Array.isArray(built.modules) ? built.modules : [],
      personalization: {
        ...built.personalization,
        questions: Array.isArray(built.personalization?.questions) ? built.personalization.questions : [],
      },
      effects: Array.isArray(built.effects) ? built.effects : [],
    };
  }, [toExperience]);

  const issues = useMemo(() => validateExperience(experience), [experience]);
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const currentMode = PREVIEW_MODES.find((m) => m.id === previewMode) ?? PREVIEW_MODES[0];

  return (
    <StudioStepLayout
      footer={
        <ContinueButton onPress={nextStep} disabled={errors.length > 0} label="Generate Link" />
      }>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <StudioScreenIntro
          title="Preview Experience"
          subtitle="See exactly what your recipient will experience. Check how it looks on different devices."
          Icon={Eye}
        />

        {/* Device Mode Selector */}
        <Animated.View entering={FadeIn.duration(400)} className="px-5 mb-5">
          <View className="flex-row bg-gray-50 rounded-2xl p-1.5">
            {PREVIEW_MODES.map(({ id, label, Icon }) => {
              const active = previewMode === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setPreviewMode(id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Preview on ${label}`}
                  className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${active ? 'bg-white' : ''}`}
                  style={active ? {
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 3,
                  } : undefined}>
                  <Icon size={16} color={active ? '#7C3AED' : '#9CA3AF'} />
                  <Text className={`text-[12px] font-bold ml-1.5 ${active ? 'text-primary' : 'text-foreground-secondary'}`}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Device Preview Frame */}
        <Animated.View entering={FadeInDown.duration(500).springify()} className="items-center px-5 mb-6">
          <View
            style={{ width: `${currentMode.widthPct}%` as `${number}%` }}
            className="rounded-[28px] overflow-hidden border-[3px] border-gray-200 bg-gray-200">
            {/* Notch */}
            {previewMode === 'mobile' && (
              <View className="h-7 bg-gray-200 items-center justify-center">
                <View className="w-24 h-5 rounded-full bg-gray-800" />
              </View>
            )}
            <View className="bg-white" style={{ maxHeight: 500 }}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 500 }}>
                <ExperiencePreview experience={experience} interactive={false} />
              </ScrollView>
            </View>
            {/* Home Indicator */}
            {previewMode === 'mobile' && (
              <View className="h-5 bg-gray-200 items-center justify-center">
                <View className="w-28 h-1 rounded-full bg-gray-400" />
              </View>
            )}
          </View>
        </Animated.View>

        {/* Validation Panel */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-5">
          <View className="flex-row items-center mb-3">
            <View className="h-8 w-8 rounded-xl bg-violet-50 items-center justify-center mr-2.5">
              <CircleCheck size={16} color="#7C3AED" />
            </View>
            <Text className="text-[15px] font-black text-foreground">Validation Check</Text>
          </View>

          {errors.length === 0 && warnings.length === 0 ? (
            <Animated.View entering={ZoomIn.springify()}>
              <LinearGradient
                colors={['#F0FDF4', '#ECFDF5']}
                className="flex-row items-center rounded-2xl p-4 border border-green-200">
                <View className="h-10 w-10 rounded-xl bg-green-100 items-center justify-center mr-3">
                  <CircleCheck size={20} color="#16A34A" />
                </View>
                <View>
                  <Text className="text-[14px] font-bold text-green-800">All checks passed!</Text>
                  <Text className="text-[12px] text-green-600 mt-0.5">Your experience is ready to go</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ) : (
            <View>
              {errors.map((issue, idx) => (
                <Animated.View
                  key={issue.field}
                  entering={FadeInDown.delay(idx * 80).duration(300)}
                  className="flex-row items-center bg-red-50 rounded-2xl p-4 mb-2 border border-red-100">
                  <View className="h-8 w-8 rounded-xl bg-red-100 items-center justify-center mr-3">
                    <TriangleAlert size={16} color="#DC2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[13px] font-bold text-red-800">{issue.message}</Text>
                    <Text className="text-[10px] text-red-500 mt-0.5">Required — must fix before publishing</Text>
                  </View>
                </Animated.View>
              ))}
              {warnings.map((issue, idx) => (
                <Animated.View
                  key={`${issue.field}-w`}
                  entering={FadeInDown.delay((errors.length + idx) * 80).duration(300)}
                  className="flex-row items-center bg-amber-50 rounded-2xl p-4 mb-2 border border-amber-100">
                  <View className="h-8 w-8 rounded-xl bg-amber-100 items-center justify-center mr-3">
                    <TriangleAlert size={16} color="#D97706" />
                  </View>
                  <Text className="text-[13px] text-amber-800 flex-1 font-medium">{issue.message}</Text>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </StudioStepLayout>
  );
}
