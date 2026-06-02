import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePerson } from '@features/people/hooks/usePeople';
import { useCardStudioStore } from '../store/card-studio.store';
import { useCardAutosave } from '../hooks/useCardAutosave';
import { CardStudioHeader } from '../components/common/CardStudioHeader';
import { StepIndicator } from '../components/common/StepIndicator';
import { Step1TemplateScreen } from './Step1TemplateScreen';
import { Step2CustomizeScreen } from './Step2CustomizeScreen';
import { Step3PreviewScreen } from './Step3PreviewScreen';
import { Step4ShareScreen } from './Step4ShareScreen';

import '../templates';

const TITLES: Record<number, string> = {
  1: 'Choose Template',
  2: 'Personalize & Design',
  3: 'Preview',
  4: 'Download & Share',
};

export function CardStudioScreen() {
  const step = useCardStudioStore((s) => s.currentStep);
  const prevStep = useCardStudioStore((s) => s.prevStep);
  const resetStore = useCardStudioStore((s) => s.reset);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);
  const setPreFilledPersonId = useCardStudioStore((s) => s.setPreFilledPersonId);
  const undo = useCardStudioStore((s) => s.undo);
  const redo = useCardStudioStore((s) => s.redo);
  const historyIndex = useCardStudioStore((s) => s.historyIndex);
  const historyLength = useCardStudioStore((s) => s.history.length);
  const selectedTemplate = useCardStudioStore((s) => s.selectedTemplate);

  useCardAutosave();

  const params = useLocalSearchParams<{ personId?: string }>();
  const { data: person } = usePerson(params.personId);

  useEffect(() => {
    if (person && params.personId) {
      setPreFilledPersonId(params.personId);
      const birthYear = parseInt(person.birthDate.split('-')[0], 10);
      const age = new Date().getFullYear() - birthYear;
      updatePersonalization({
        recipientName: person.fullName,
        relationship: person.relationship,
        age: age > 0 ? String(age) : '',
        eventType: person.eventType,
        photoUri: person.avatarUri || undefined,
      });
    }
  }, [person, params.personId, setPreFilledPersonId, updatePersonalization]);

  useEffect(() => {
    if (step === 2 && !selectedTemplate) {
      resetStore();
      router.replace('/card-studio');
    }
  }, [step, selectedTemplate, resetStore]);

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
      <CardStudioHeader
        onBack={handleBack}
        title={TITLES[step]}
        showUndoRedo={step === 2}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < historyLength - 1}
      />
      <StepIndicator currentStep={step} />
      <View className="flex-1">{renderStep()}</View>
    </SafeAreaView>
  );
}
