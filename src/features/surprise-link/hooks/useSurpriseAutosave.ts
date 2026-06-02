import { useEffect, useRef } from 'react';

import { surpriseLinkService } from '@services/surprise-link/surprise-link.service';
import { generateExperienceId } from '../utils/link-generator';

import { useSurpriseLinkStore } from '../store/surprise-link.store';

const AUTOSAVE_MS = 4000;

export function useSurpriseAutosave() {
  const toExperience = useSurpriseLinkStore((s) => s.toExperience);
  const experienceId = useSurpriseLinkStore((s) => s.experienceId);
  const selectedTemplate = useSurpriseLinkStore((s) => s.selectedTemplate);
  const occasion = useSurpriseLinkStore((s) => s.occasion);
  const personalization = useSurpriseLinkStore((s) => s.personalization);
  const modules = useSurpriseLinkStore((s) => s.modules);
  const theme = useSurpriseLinkStore((s) => s.theme);
  const effects = useSurpriseLinkStore((s) => s.effects);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedTemplate || !occasion) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        let id = experienceId;
        if (!id) {
          id = await generateExperienceId();
          useSurpriseLinkStore.setState({ experienceId: id });
        }
        const exp = { ...toExperience(), id };
        await surpriseLinkService.saveExperience(exp);
      } catch {
        /* silent autosave failure */
      }
    }, AUTOSAVE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    toExperience,
    experienceId,
    selectedTemplate,
    occasion,
    personalization,
    modules,
    theme,
    effects,
  ]);
}
