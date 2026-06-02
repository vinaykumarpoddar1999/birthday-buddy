import React, { memo, useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Heart, Sparkles } from 'lucide-react-native';

import type { SurpriseExperience } from '../../types';
import { ModuleRenderer } from './ModuleRenderer';
import { VisualEffectsLayer } from './VisualEffectsLayer';

interface ExperiencePreviewProps {
  experience: SurpriseExperience;
  interactive?: boolean;
  onSectionView?: (sectionId: string) => void;
}

export const ExperiencePreview = memo(function ExperiencePreview({
  experience,
  interactive = false,
  onSectionView,
}: ExperiencePreviewProps) {
  const { theme, personalization, modules, effects } = experience;
  const safeModules = Array.isArray(modules) ? modules : [];
  const safeQuestions = Array.isArray(personalization.questions) ? personalization.questions : [];
  const recipient = personalization.recipientName || personalization.nickname || 'You';

  const handleScroll = useCallback(
    (moduleId: string) => {
      onSectionView?.(moduleId);
    },
    [onSectionView],
  );

  return (
    <View style={{ backgroundColor: theme.backgroundColor, minHeight: 400 }} className="flex-1">
      <VisualEffectsLayer effects={effects} />

      {personalization.hero.coverImageUri && (
        <View className="overflow-hidden">
          <Image
            source={{ uri: personalization.hero.coverImageUri }}
            style={{ width: '100%', height: 160 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', theme.backgroundColor]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}
          />
        </View>
      )}

      <LinearGradient
        colors={[theme.primaryColor, theme.secondaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-8 pb-10 items-center">
        {personalization.hero.heroImageUri ? (
          <Animated.View entering={FadeIn.duration(600)} className="mb-4">
            <Image
              source={{ uri: personalization.hero.heroImageUri }}
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                borderWidth: 3,
                borderColor: 'rgba(255,255,255,0.4)',
              }}
              contentFit="cover"
            />
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(600)}
            className="h-16 w-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Heart size={28} color="#FFF" strokeWidth={1.5} />
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View className="flex-row items-center justify-center mb-2">
            <Sparkles size={12} color="rgba(255,255,255,0.7)" />
            <Text
              style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginLeft: 6 }}>
              A surprise for
            </Text>
          </View>
          <Text
            style={{
              color: '#FFF',
              fontSize: 28,
              fontWeight: '900',
              textAlign: 'center',
              letterSpacing: -0.5,
            }}>
            {recipient}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 14,
              marginTop: 12,
              textAlign: 'center',
              lineHeight: 22,
              paddingHorizontal: 16,
            }}>
            {personalization.hero.welcomeMessage}
          </Text>
        </Animated.View>

        {personalization.senderName ? (
          <Animated.View entering={FadeInDown.delay(600).duration(500)}>
            <View
              className="flex-row items-center mt-5 px-4 py-2 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600' }}>
                With love from {personalization.senderName}
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4" scrollEnabled={interactive} contentContainerStyle={{ paddingBottom: 24 }}>
        {safeQuestions.filter((q) => q.answer.trim()).length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)} className="mb-4">
            {safeQuestions
              .filter((q) => q.answer.trim())
              .map((q, idx) => (
                <Animated.View
                  key={q.id}
                  entering={FadeInDown.delay(400 + idx * 100).duration(400)}
                  className="mb-3 p-4 rounded-2xl border"
                  style={{
                    backgroundColor: `${theme.primaryColor}08`,
                    borderColor: `${theme.primaryColor}15`,
                  }}>
                  <Text style={{ color: theme.primaryColor, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>
                    {q.label.toUpperCase()}
                  </Text>
                  <Text style={{ color: theme.textColor, fontSize: 15, marginTop: 6, lineHeight: 22 }}>
                    {q.answer}
                  </Text>
                  {q.imageUri && (
                    <Image
                      source={{ uri: q.imageUri }}
                      style={{ width: '100%', height: 120, borderRadius: 12, marginTop: 8 }}
                      contentFit="cover"
                    />
                  )}
                </Animated.View>
              ))}
          </Animated.View>
        )}

        {safeModules.map((mod, idx) => (
          <ModuleRenderer
            key={mod.id}
            module={mod}
            theme={theme}
            interactive={interactive}
            onView={() => handleScroll(mod.id)}
            index={idx}
          />
        ))}
      </ScrollView>
    </View>
  );
});
