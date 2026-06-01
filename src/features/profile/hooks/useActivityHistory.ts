import { useQuery } from '@tanstack/react-query';

import { activityLogService } from '@/services/activity/activity-log.service';

export function useActivityHistory() {
  return useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => activityLogService.getRecent(100),
  });
}
