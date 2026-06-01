import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePeopleStore, type StoredPerson } from '@store/people.store';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { generateWish, registerWishData } from '../engine/wish-generator';

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
    // Data files may not exist yet
  }
}

export function AIWishGeneratorScreen() {
  const params = useLocalSearchParams<{ personId?: string }>();

  const people = usePeopleStore((s) => s.people);
  const getPersonById = usePeopleStore((s) => s.getPersonById);

  const activeTab = useAIWishesStore((s) => s.activeTab);
  const selectedPersonId = useAIWishesStore((s) => s.selectedPersonId);
  const setSelectedPersonId = useAIWishesStore((s) => s.setSelectedPersonId);

  const selectedTone = useAIWishesStore((s) => s.selectedTone);
  const selectedLength = useAIWishesStore((s) => s.selectedLength);
  const selectedLanguage = useAIWishesStore((s) => s.selectedLanguage);
  const personalContext = useAIWishesStore((s) => s.personalContext);

  const currentWish = useAIWishesStore((s) => s.currentWish);
  const generatedWishes = useAIWishesStore((s) => s.generatedWishes);
  const isGenerating = useAIWishesStore((s) => s.isGenerating);
  const generationCount = useAIWishesStore((s) => s.generationCount);

  const addGeneratedWish = useAIWishesStore((s) => s.addGeneratedWish);
  const addToHistory = useAIWishesStore((s) => s.addToHistory);
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

  const person = useMemo(() => {
    if (selectedPersonId) return getPersonById(selectedPersonId);
    return people[0] || null;
  }, [selectedPersonId, getPersonById, people]);

  const personAge = useMemo(() => {
    if (!person) return 0;
    const birthYear = parseInt(person.birthDate.split('-')[0], 10);
    return new Date().getFullYear() - birthYear;
  }, [person]);

  const handleGenerate = useCallback(() => {
    if (!person) return;
    if (credits <= 0) return;

    setIsGenerating(true);

    setTimeout(() => {
      const hasCredit = deductCredit();
      if (!hasCredit) {
        setIsGenerating(false);
        return;
      }

      const wish = generateWish({
        tone: selectedTone,
        length: selectedLength,
        language: selectedLanguage,
        personId: person.id,
        personName: person.fullName,
        relationship: person.relationship,
        personalContext,
        age: personAge,
      });

      addGeneratedWish(wish);
      addToHistory({ ...wish, sharedVia: [], usedInCard: false });
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
    addGeneratedWish,
    addToHistory,
  ]);

  const handleBack = () => {
    router.back();
  };

  if (!person) return null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <WishHeader onBack={handleBack} />

      {activeTab === 'generate' ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-4"
          keyboardShouldPersistTaps="handled">
          {/* Person Profile */}
          <PersonProfileCard person={person} />

          {/* Tone Selector */}
          <ToneSelector />

          {/* Length Selector */}
          <LengthSelector />

          {/* Language + Personal Touch */}
          <LanguageSelector />
          <PersonalTouchInput />

          {/* Generate Button */}
          <GenerateButton
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generationCount={generationCount}
          />

          {/* Generated Wish */}
          {currentWish && (
            <>
              <GeneratedWishCard
                wish={currentWish}
                wishIndex={credits}
                totalWishes={24}
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
