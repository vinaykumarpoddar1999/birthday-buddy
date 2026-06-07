import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePerson } from '@features/people/hooks/usePeople';
import { useCardStudioStore } from '../store/card-studio.store';
import { CardStudioHeader } from '../components/common/CardStudioHeader';
import { Step1TemplateScreen } from './Step1TemplateScreen';
import { Step2CustomizeScreen } from './Step2CustomizeScreen';
import { Step3PreviewScreen } from './Step3PreviewScreen';
import { Step4ShareScreen } from './Step4ShareScreen';

import '../templates';

const TITLES: Record<number, string> = {
  1: 'Choose Template',
  2: 'Edit',
  3: 'Preview',
  4: 'Download',
};

export function CardStudioScreen() {
  const step = useCardStudioStore((s) => s.currentStep);
  const nextStep = useCardStudioStore((s) => s.nextStep);
  const prevStep = useCardStudioStore((s) => s.prevStep);
  const resetStore = useCardStudioStore((s) => s.reset);
  const updatePersonalization = useCardStudioStore((s) => s.updatePersonalization);
  const setPreFilledPersonId = useCardStudioStore((s) => s.setPreFilledPersonId);
  const personPrefillApplied = useCardStudioStore((s) => s.personPrefillApplied);
  const undo = useCardStudioStore((s) => s.undo);
  const redo = useCardStudioStore((s) => s.redo);
  const historyIndex = useCardStudioStore((s) => s.historyIndex);
  const historyLength = useCardStudioStore((s) => s.history.length);
  const selectedTemplate = useCardStudioStore((s) => s.selectedTemplate);

  const params = useLocalSearchParams<{ personId?: string }>();
  const { data: person } = usePerson(params.personId);

  useEffect(() => {
    if (params.personId) {
      setPreFilledPersonId(params.personId);
    }
  }, [params.personId, setPreFilledPersonId]);

  useEffect(() => {
    if (!person || !params.personId || personPrefillApplied) return;
    const birthYear = parseInt(person.birthDate.split('-')[0], 10);
    const age = new Date().getFullYear() - birthYear;
    updatePersonalization({
      recipientName: person.fullName,
      relationship: person.relationship,
      age: age > 0 ? String(age) : '',
      eventType: person.eventType,
      photoUri: person.avatarUri || undefined,
    });
    useCardStudioStore.setState({ personPrefillApplied: true });
  }, [person, params.personId, personPrefillApplied, updatePersonalization]);

  useEffect(() => {
    if (step >= 2 && step <= 4 && !selectedTemplate) {
      prevStep();
    }
  }, [step, selectedTemplate, prevStep]);

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
      case 1:
        return <Step1TemplateScreen />;
      case 2:
        return selectedTemplate ? <Step2CustomizeScreen /> : <Step1TemplateScreen />;
      case 3:
        return selectedTemplate ? <Step3PreviewScreen /> : <Step1TemplateScreen />;
      case 4:
        return selectedTemplate ? <Step4ShareScreen /> : <Step1TemplateScreen />;
      default:
        return <Step1TemplateScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <CardStudioHeader
        onBack={handleBack}
        title={TITLES[step]}
        hideTitleIcon={step === 2}
        showUndoRedo={step === 2}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < historyLength - 1}
        primaryAction={step === 2 ? { label: 'Preview', onPress: nextStep } : undefined}
      />
      <View className="flex-1">{renderStep()}</View>
    </SafeAreaView>
  );
}
