import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePeopleStore } from '@store/people.store';
import { useCardStudioStore } from '../store/card-studio.store';
import { CardStudioHeader } from '../components/common/CardStudioHeader';
import { StepIndicator } from '../components/common/StepIndicator';
import { Step1TemplateScreen } from './Step1TemplateScreen';
import { Step2CustomizeScreen } from './Step2CustomizeScreen';
import { Step3PreviewScreen } from './Step3PreviewScreen';
import { Step4ShareScreen } from './Step4ShareScreen';

import '../templates';

const TITLES: Record<number, string> = {
  1: 'Create Card',
  2: 'Customize',
  3: 'Preview',
  4: 'Share',
};

export function CardStudioScreen() {
  const step = useCardStudioStore((s) => s.currentStep);
  const prevStep = useCardStudioStore((s) => s.prevStep);
  const resetStore = useCardStudioStore((s) => s.reset);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);
  const setPreFilledPersonId = useCardStudioStore((s) => s.setPreFilledPersonId);

  const params = useLocalSearchParams<{ personId?: string }>();
  const getPersonById = usePeopleStore((s) => s.getPersonById);

  useEffect(() => {
    if (params.personId) {
      const person = getPersonById(params.personId);
      if (person) {
        setPreFilledPersonId(params.personId);
        const birthYear = parseInt(person.birthDate.split('-')[0], 10);
        const age = new Date().getFullYear() - birthYear;
        updatePersonalization({
          recipientName: person.fullName,
          relationship: person.relationship,
          age: age > 0 ? String(age) : '',
          eventType: person.eventType,
          photoUri: person.profileImage || undefined,
        });
      }
    }
  }, [params.personId, getPersonById, setPreFilledPersonId, updatePersonalization]);

  const handleBack = () => {
    if (step > 1) {
      prevStep();
    } else {
      resetStore();
      router.back();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1TemplateScreen />;
      case 2: return <Step2CustomizeScreen />;
      case 3: return <Step3PreviewScreen />;
      case 4: return <Step4ShareScreen />;
      default: return <Step1TemplateScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <CardStudioHeader onBack={handleBack} title={TITLES[step]} />
      <StepIndicator currentStep={step} />
      <View className="flex-1">{renderStep()}</View>
    </SafeAreaView>
  );
}
