import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import { UserPlus, Wand2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { EmptyState, ErrorState, ListSkeleton } from '@shared/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { usePeople, usePerson } from '@features/people/hooks/usePeople';
import { wishHistoryQueryKey } from '../hooks/useWishHistory';
import { wishService } from '@/services/wish/wish.service';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { registerWishData } from '../engine/wish-generator';
import { WishHeader } from '../components/WishHeader';
import { PersonProfileCard } from '../components/PersonProfileCard';
import { ToneSelector } from '../components/ToneSelector';
import { LengthSelector } from '../components/LengthSelector';
import { GenerateButton } from '../components/GenerateButton';
import { GeneratedWishCard } from '../components/GeneratedWishCard';
import { ShareSection } from '../components/ShareSection';

let dataRegistered = false;

async function ensureDataRegistered() {
  if (dataRegistered) return;
  try {
    const data = await import('../data');
    if (data.heartfeltWishes) registerWishData(data.heartfeltWishes);
    if (data.funnyWishes) registerWishData(data.funnyWishes);
    if (data.romanticWishes) registerWishData(data.romanticWishes);
    if (data.motivationalWishes) registerWishData(data.motivationalWishes);
    if (data.cuteWishes) registerWishData(data.cuteWishes);
    if (data.professionalWishes) registerWishData(data.professionalWishes);
    if (data.shortSweetWishes) registerWishData(data.shortSweetWishes);
    dataRegistered = true;
  } catch {
    /* Data files may not exist yet */
  }
}

export function AIWishGeneratorScreen() {
  const params = useLocalSearchParams<{ personId?: string }>();
  const queryClient = useQueryClient();

  const { data: people = [], isLoading: peopleLoading, isError: peopleError, refetch } = usePeople();

  const selectedPersonId = useAIWishesStore((s) => s.selectedPersonId);
  const setSelectedPersonId = useAIWishesStore((s) => s.setSelectedPersonId);
  const selectedTone = useAIWishesStore((s) => s.selectedTone);
  const selectedLength = useAIWishesStore((s) => s.selectedLength);
  const currentWish = useAIWishesStore((s) => s.currentWish);
  const isGenerating = useAIWishesStore((s) => s.isGenerating);
  const generationCount = useAIWishesStore((s) => s.generationCount);
  const setCurrentWish = useAIWishesStore((s) => s.setCurrentWish);
  const incrementGenerationCount = useAIWishesStore((s) => s.incrementGenerationCount);
  const setIsGenerating = useAIWishesStore((s) => s.setIsGenerating);

  useEffect(() => {
    void ensureDataRegistered();
  }, []);

  useEffect(() => {
    if (params.personId) {
      setSelectedPersonId(params.personId);
    } else if (!selectedPersonId && people.length > 0) {
      setSelectedPersonId(people[0].id);
    }
  }, [params.personId, selectedPersonId, people, setSelectedPersonId]);

  const resolvedPersonId = selectedPersonId ?? params.personId ?? people[0]?.id;
  const { data: personFromDb } = usePerson(resolvedPersonId);
  const person = personFromDb ?? people.find((p) => p.id === resolvedPersonId) ?? null;

  const personAge = useMemo(() => {
    if (!person) return 0;
    const birthYear = parseInt(person.birthDate.split('-')[0], 10);
    return new Date().getFullYear() - birthYear;
  }, [person]);

  const handleGenerate = useCallback(async () => {
    if (!person) return;
    setIsGenerating(true);
    try {
      const saved = await wishService.generateAndSave(person.id, {
        tone: selectedTone,
        length: selectedLength,
        language: 'english',
        relationship: person.relationship,
        personalContext: '',
        age: personAge,
      });
      setCurrentWish(saved);
      incrementGenerationCount();
      await queryClient.invalidateQueries({ queryKey: wishHistoryQueryKey });
    } catch {
      feedback.error('Generation failed', 'Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [
    person,
    selectedTone,
    selectedLength,
    personAge,
    setIsGenerating,
    setCurrentWish,
    incrementGenerationCount,
    queryClient,
  ]);

  const handleBack = () => {
    router.back();
  };

  if (peopleLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <WishHeader onBack={handleBack} />
        <ListSkeleton rows={6} />
      </SafeAreaView>
    );
  }

  if (peopleError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <WishHeader onBack={handleBack} />
        <ErrorState kind="database" onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  if (!person) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <WishHeader onBack={handleBack} />
        <EmptyState
          icon={UserPlus}
          title="No people yet"
          subtitle="Add someone first to generate personalized wishes."
          primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
          secondaryAction={{ label: 'Go Back', onPress: handleBack }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <WishHeader onBack={handleBack} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled">
        <PersonProfileCard person={person} />

        <Animated.View entering={FadeInDown.delay(80).duration(400)} className="px-5 mb-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Wand2 size={16} color="#7C3AED" />
            <Text className="text-[13px] font-extrabold text-foreground">Customize your wish</Text>
          </View>
        </Animated.View>

        <ToneSelector />
        <LengthSelector />

        <GenerateButton
          onGenerate={() => void handleGenerate()}
          isGenerating={isGenerating}
          generationCount={generationCount}
        />

        {currentWish && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <GeneratedWishCard wish={currentWish} />
            <ShareSection personName={person.fullName} />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
