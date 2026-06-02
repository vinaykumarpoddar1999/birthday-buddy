import React, { useCallback, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Send, X, ChevronLeft } from 'lucide-react-native';
import { feedback } from '@/shared/feedback';

import { ErrorState, PageSkeleton } from '@shared/ui';

import { ExperiencePreview } from '../components/viewer/ExperiencePreview';
import { LandingScreen, OpeningAnimation } from '../components/viewer/OpeningAnimation';
import { ReactionBar } from '../components/viewer/ReactionBar';
import { useAddReaction, useAddReply, useRecordView, useSurpriseBySlug } from '../hooks/useSurpriseLinks';
import type { ReactionType, SurpriseExperience } from '../types';

type ViewPhase = 'landing' | 'opening' | 'experience';

export function SurpriseExperienceViewerScreen() {
  const params = useLocalSearchParams<{ slug?: string }>();
  const { data: experience, isLoading, isError } = useSurpriseBySlug(params.slug);
  const recordView = useRecordView();
  const addReaction = useAddReaction();
  const addReply = useAddReply();

  const [phase, setPhase] = useState<ViewPhase>('landing');
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [viewedSections, setViewedSections] = useState<string[]>([]);

  const normalizeExperience = useCallback(
    (exp: SurpriseExperience): SurpriseExperience => ({
      ...exp,
      modules: Array.isArray(exp.modules) ? exp.modules : [],
      effects: Array.isArray(exp.effects) ? exp.effects : [],
      personalization: {
        ...exp.personalization,
        questions: Array.isArray(exp.personalization?.questions) ? exp.personalization.questions : [],
      },
    }),
    [],
  );

  const handleOpen = useCallback(() => {
    setPhase('opening');
  }, []);

  const handleOpeningComplete = useCallback(() => {
    setPhase('experience');
    if (experience?.id) {
      recordView.mutate({ id: experience.id });
    }
  }, [experience?.id, recordView]);

  const handleSectionView = useCallback(
    (sectionId: string) => {
      setViewedSections((prev) => {
        if (prev.includes(sectionId)) return prev;
        const next = [...prev, sectionId];
        if (experience?.id) {
          recordView.mutate({ id: experience.id, sectionId });
        }
        return next;
      });
    },
    [experience?.id, recordView],
  );

  const handleReact = useCallback(
    (type: ReactionType) => {
      if (!experience?.id) return;
      addReaction.mutate({ id: experience.id, type });
      feedback.success('Sent!', 'Your reaction was recorded');
    },
    [experience?.id, addReaction],
  );

  const handleSendReply = useCallback(() => {
    if (!experience?.id || !replyText.trim()) return;
    addReply.mutate({ id: experience.id, type: 'text', content: replyText.trim() });
    setReplyText('');
    setReplyVisible(false);
    feedback.success('Sent!', 'Your reply was sent');
  }, [experience?.id, replyText, addReply]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <PageSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !experience) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ErrorState
          title="Surprise not found"
          message="This link may have expired or doesn't exist yet."
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const safeExperience = normalizeExperience(experience);

  if (phase === 'landing') {
    return (
      <LandingScreen
        senderName={safeExperience.personalization.senderName}
        welcomeMessage={safeExperience.personalization.hero.welcomeMessage}
        onOpen={handleOpen}
        onClose={() => router.back()}
      />
    );
  }

  if (phase === 'opening') {
    return (
      <OpeningAnimation
        type={safeExperience.personalization.hero.openingAnimation}
        onComplete={handleOpeningComplete}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <View className="absolute top-2 left-4 z-20">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close experience"
          className="h-11 w-11 rounded-full bg-black/30 items-center justify-center">
          <ChevronLeft size={22} color="#FFF" />
        </Pressable>
      </View>
      <ExperiencePreview
        experience={safeExperience}
        interactive
        onSectionView={handleSectionView}
      />
      <ReactionBar onReact={handleReact} onReply={() => setReplyVisible(true)} />

      <Modal visible={replyVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setReplyVisible(false)}
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Animated.View entering={FadeInUp.springify()}>
            <Pressable onPress={() => {}} className="bg-white rounded-t-3xl overflow-hidden">
              <LinearGradient
                colors={['#F5F3FF', '#FFFFFF']}
                className="p-6">
                <View className="flex-row items-center justify-between mb-5">
                  <Text className="text-[18px] font-black text-foreground">Send a Reply</Text>
                  <Pressable
                    onPress={() => setReplyVisible(false)}
                    accessibilityRole="button"
                    className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
                    <X size={18} color="#6B7280" />
                  </Pressable>
                </View>

                <TextInput
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                  placeholder="Write something lovely..."
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[120px] text-[15px] text-foreground mb-5"
                  style={{ textAlignVertical: 'top' }}
                  autoFocus
                />

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setReplyVisible(false)}
                    accessibilityRole="button"
                    className="flex-1 py-3.5 rounded-2xl bg-gray-100 items-center">
                    <Text className="font-bold text-foreground-secondary text-[15px]">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSendReply}
                    accessibilityRole="button"
                    className="flex-1 rounded-2xl overflow-hidden"
                    style={{ opacity: replyText.trim() ? 1 : 0.5 }}>
                    <LinearGradient
                      colors={['#7C3AED', '#EC4899']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="py-3.5 flex-row items-center justify-center">
                      <Send size={16} color="#FFF" />
                      <Text className="font-bold text-white text-[15px] ml-2">Send</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
