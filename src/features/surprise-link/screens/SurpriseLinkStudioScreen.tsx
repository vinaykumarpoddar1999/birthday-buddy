import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { usePerson } from '@features/people/hooks/usePeople';

import { StepIndicator } from '../components/common/StepIndicator';
import { StudioHeader } from '../components/common/StudioHeader';
import { useSurpriseAutosave } from '../hooks/useSurpriseAutosave';
import { useSurpriseLinkStore } from '../store/surprise-link.store';
import type { Occasion, StudioStep } from '../types';
import { Step1OccasionScreen } from './steps/Step1OccasionScreen';
import { Step2RecipientScreen } from './steps/Step2RecipientScreen';
import { Step3TemplateScreen } from './steps/Step3TemplateScreen';
import { Step4CustomizeScreen } from './steps/Step4CustomizeScreen';
import { Step5ModulesScreen } from './steps/Step5ModulesScreen';
import { Step6ThemeScreen } from './steps/Step6ThemeScreen';
import { Step7PreviewScreen } from './steps/Step7PreviewScreen';
import { Step8LinkScreen } from './steps/Step8LinkScreen';
import { Step9ShareScreen } from './steps/Step9ShareScreen';

const TITLES: Record<StudioStep, string> = {
  1: 'Choose Occasion',
  2: 'Recipient Type',
  3: 'Experience Templates',
  4: 'Customize Experience',
  5: 'Add Modules',
  6: 'Theme & Effects',
  7: 'Preview',
  8: 'Generate Link',
  9: 'Share Experience',
};

export function SurpriseLinkStudioScreen() {
  const rawStep = useSurpriseLinkStore((s) => s.currentStep);
  const prevStep = useSurpriseLinkStore((s) => s.prevStep);
  const reset = useSurpriseLinkStore((s) => s.reset);
  const updatePersonalization = useSurpriseLinkStore((s) => s.updatePersonalization);
  const setPersonId = useSurpriseLinkStore((s) => s.setPersonId);
  const setOccasion = useSurpriseLinkStore((s) => s.setOccasion);
  const setStep = useSurpriseLinkStore((s) => s.setStep);
  const step = Math.min(9, Math.max(1, rawStep)) as StudioStep;

  useSurpriseAutosave();

  const params = useLocalSearchParams<{
    personId?: string;
    occasion?: string;
    fromWish?: string;
    fromCard?: string;
  }>();
  const { data: person } = usePerson(params.personId);

  useEffect(() => {
    if (person && params.personId) {
      setPersonId(params.personId);
      updatePersonalization({
        recipientName: person.fullName,
        nickname: person.nickname ?? '',
        relationship: person.relationship,
        occasionDate: person.birthDate,
      });
      if (person.eventType === 'birthday') {
        setOccasion('birthday');
      } else if (person.eventType === 'anniversary') {
        setOccasion('anniversary');
      }
    }
  }, [person, params.personId, setPersonId, updatePersonalization, setOccasion]);

  useEffect(() => {
    if (params.occasion) {
      setOccasion(params.occasion as Occasion);
    }
  }, [params.occasion, setOccasion]);

  useEffect(() => {
    if (params.fromWish === '1' || params.fromCard === '1') {
      setStep(4);
    }
  }, [params.fromWish, params.fromCard, setStep]);

  const handleBack = () => {
    if (step > 1) {
      prevStep();
    } else {
      reset();
      router.back();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1OccasionScreen />;
      case 2: return <Step2RecipientScreen />;
      case 3: return <Step3TemplateScreen />;
      case 4: return <Step4CustomizeScreen />;
      case 5: return <Step5ModulesScreen />;
      case 6: return <Step6ThemeScreen />;
      case 7: return <Step7PreviewScreen />;
      case 8: return <Step8LinkScreen />;
      case 9: return <Step9ShareScreen />;
      default: return <Step1OccasionScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <LinearGradient
        colors={['#FAFAFF', '#F5F3FF', '#FFFFFF']}
        style={{ flex: 1 }}>
        <StudioHeader onBack={handleBack} title={TITLES[step]} />
        <StepIndicator currentStep={step} />
        <View className="flex-1" style={{ minHeight: 0 }}>
          {renderStep()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
