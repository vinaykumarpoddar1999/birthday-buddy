import { useMutation } from '@tanstack/react-query';

import { analytics, ANALYTICS_EVENTS } from '@services/analytics';
import {
  cancelScheduledNotifications,
  scheduleBirthdayReminders,
  type ScheduleBirthdayRemindersInput,
} from '@services/notifications';

export function useReminders() {
  const scheduleMutation = useMutation({
    mutationFn: (input: ScheduleBirthdayRemindersInput) => scheduleBirthdayReminders(input),
    onSuccess: () => analytics.track(ANALYTICS_EVENTS.REMINDER_TRIGGERED),
  });

  const cancelMutation = useMutation({
    mutationFn: (ids: string[]) => cancelScheduledNotifications(ids),
  });

  return {
    scheduleReminders: scheduleMutation.mutateAsync,
    cancelReminders: cancelMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
  };
}
