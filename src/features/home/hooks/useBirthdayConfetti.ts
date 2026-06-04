import { useEffect, useState } from 'react';

import {
  markBirthdayConfettiShown,
  shouldShowBirthdayConfetti,
} from '@/services/engagement/birthday-confetti.service';
import { getDaysUntilBirthday } from '@features/people/utils/birthday-utils';

const CONFETTI_DURATION_MS = 8000;

export function useBirthdayConfetti(personId: string | undefined, birthDate: string | undefined) {
  const [showConfetti, setShowConfetti] = useState(false);
  const isToday = birthDate ? getDaysUntilBirthday(birthDate) === 0 : false;

  useEffect(() => {
    if (!personId || !isToday) {
      setShowConfetti(false);
      return;
    }

    let cancelled = false;
    void (async () => {
      const allowed = await shouldShowBirthdayConfetti(personId);
      if (cancelled || !allowed) return;
      setShowConfetti(true);
      await markBirthdayConfettiShown(personId);
      setTimeout(() => {
        if (!cancelled) setShowConfetti(false);
      }, CONFETTI_DURATION_MS);
    })();

    return () => {
      cancelled = true;
    };
  }, [personId, isToday]);

  return { showConfetti, isToday };
}
