import React, { useCallback, useEffect, useMemo } from 'react';

import { ScrollView, Text, View } from 'react-native';
import { feedback } from '@/shared/feedback';
import { UserPlus } from 'lucide-react-native';

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

import { LanguageSelector } from '../components/LanguageSelector';

import { PersonalTouchInput } from '../components/PersonalTouchInput';

import { GenerateButton } from '../components/GenerateButton';

import { GeneratedWishCard } from '../components/GeneratedWishCard';

import { WishCardPreview } from '../components/WishCardPreview';

import { ShareSection } from '../components/ShareSection';

import { CreateCardCTA } from '../components/CreateCardCTA';

import { WishBottomTabs } from '../components/WishBottomTabs';

import { WishHistoryTab } from '../components/WishHistoryTab';

import { MyTemplatesTab } from '../components/MyTemplatesTab';



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



  const activeTab = useAIWishesStore((s) => s.activeTab);

  const selectedPersonId = useAIWishesStore((s) => s.selectedPersonId);

  const setSelectedPersonId = useAIWishesStore((s) => s.setSelectedPersonId);



  const selectedTone = useAIWishesStore((s) => s.selectedTone);

  const selectedLength = useAIWishesStore((s) => s.selectedLength);

  const selectedLanguage = useAIWishesStore((s) => s.selectedLanguage);

  const personalContext = useAIWishesStore((s) => s.personalContext);



  const currentWish = useAIWishesStore((s) => s.currentWish);

  const isGenerating = useAIWishesStore((s) => s.isGenerating);

  const generationCount = useAIWishesStore((s) => s.generationCount);



  const setCurrentWish = useAIWishesStore((s) => s.setCurrentWish);

  const setIsGenerating = useAIWishesStore((s) => s.setIsGenerating);

  const deductCredit = useAIWishesStore((s) => s.useCredit);

  const credits = useAIWishesStore((s) => s.credits);



  useEffect(() => {

    ensureDataRegistered();

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



  const handleGenerate = useCallback(() => {

    if (!person) return;

    if (credits <= 0) return;



    setIsGenerating(true);



    setTimeout(async () => {
      try {
        const saved = await wishService.generateAndSave(person.id, {
          tone: selectedTone,
          length: selectedLength,
          language: selectedLanguage,
          relationship: person.relationship,
          personalContext,
          age: personAge,
        });

        if (!deductCredit()) {
          setIsGenerating(false);
          return;
        }

        setCurrentWish(saved);
        await queryClient.invalidateQueries({ queryKey: wishHistoryQueryKey });
      } catch {
        feedback.error('Generation failed', 'Please try again.');
      }

      setIsGenerating(false);
    }, 800 + Math.random() * 600);

  }, [

    person,

    credits,

    selectedTone,

    selectedLength,

    selectedLanguage,

    personalContext,

    personAge,

    setIsGenerating,

    deductCredit,

    setCurrentWish,

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
          subtitle="Add someone first to generate personalized AI wishes from your SQLite contacts."
          primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
          secondaryAction={{ label: 'Go Back', onPress: handleBack }}
        />
      </SafeAreaView>
    );
  }



  return (

    <SafeAreaView className="flex-1 bg-background" edges={['top']}>

      <WishHeader onBack={handleBack} />



      {activeTab === 'generate' ? (

        <ScrollView

          className="flex-1"

          showsVerticalScrollIndicator={false}

          contentContainerClassName="pb-4"

          keyboardShouldPersistTaps="handled">

          <PersonProfileCard person={person} />

          <ToneSelector />

          <LengthSelector />

          <LanguageSelector />

          <PersonalTouchInput />



          <GenerateButton

            onGenerate={handleGenerate}

            isGenerating={isGenerating}

            generationCount={generationCount}

          />



          {currentWish && (

            <>

              <GeneratedWishCard

                wish={currentWish}

                wishIndex={credits}
                totalWishes={credits}
                onRegenerate={handleGenerate}

              />



              <WishCardPreview personName={person.fullName} />

              <ShareSection />

              <CreateCardCTA />

            </>

          )}

        </ScrollView>

      ) : activeTab === 'history' ? (

        <WishHistoryTab />

      ) : (

        <MyTemplatesTab />

      )}



      <WishBottomTabs />

    </SafeAreaView>

  );

}


