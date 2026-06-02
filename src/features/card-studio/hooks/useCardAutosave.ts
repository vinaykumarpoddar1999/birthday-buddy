import { useEffect, useRef } from 'react';

import { useCardStudioStore } from '../store/card-studio.store';

const AUTOSAVE_DELAY_MS = 3000;

export function useCardAutosave() {
  const step = useCardStudioStore((s) => s.currentStep);
  const elements = useCardStudioStore((s) => s.elements);
  const personalization = useCardStudioStore((s) => s.personalization);
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const canvasFormat = useCardStudioStore((s) => s.canvasFormat);
  const selectedTemplate = useCardStudioStore((s) => s.selectedTemplate);
  const autoSave = useCardStudioStore((s) => s.autoSave);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (step !== 2 || !selectedTemplate) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      autoSave();
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, selectedTemplate, elements, personalization, customBackground, canvasFormat, autoSave]);
}
