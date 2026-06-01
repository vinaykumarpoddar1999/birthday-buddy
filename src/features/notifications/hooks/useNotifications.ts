import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { appNotificationService } from '@/services/notifications/app-notification.service';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
};

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationQueryKeys.all,
    queryFn: () => appNotificationService.list(),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => appNotificationService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
  });

  return {
    notifications: query.data ?? [],
    isLoading: query.isLoading,
    markRead: markRead.mutate,
  };
}
