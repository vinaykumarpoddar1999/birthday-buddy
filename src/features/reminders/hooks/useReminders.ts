import { useMutation } from '@tanstack/react-query';

import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import type { ScheduleBirthdayRemindersInput } from '@services/notifications';
import { cancelReminders, scheduleReminders } from '../api/reminders.api';

export function useReminders() {
  const scheduleMutation = useMutation({
    mutationFn: (input: ScheduleBirthdayRemindersInput) => scheduleReminders(input),
    onSuccess: () => analytics.track(ANALYTICS_EVENTS.REMINDER_TRIGGERED),
  });

  const cancelMutation = useMutation({
    mutationFn: (ids: string[]) => cancelReminders(ids),
  });

  return {
    scheduleReminders: scheduleMutation.mutateAsync,
    cancelReminders: cancelMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
  };
}
