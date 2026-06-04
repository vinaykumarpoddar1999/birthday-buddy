import { useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import {
  recordMainAppEntry,
  scheduleEngagementEvaluateOnForeground,
} from '@/services/engagement/engagement-prompts.service';
import {
  setEngagementRouteSegment,
} from '@/services/engagement/engagement-context';

export function EngagementRouteTracker() {
  const segments = useSegments();

  useEffect(() => {
    const root = (segments[0] as string | undefined) ?? null;
    setEngagementRouteSegment(root);

    if (root === '(tabs)') {
      void recordMainAppEntry();
    }
  }, [segments]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        scheduleEngagementEvaluateOnForeground();
      }
    });
    return () => sub.remove();
  }, []);

  return null;
}
