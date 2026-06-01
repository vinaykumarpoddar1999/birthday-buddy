import { activityLogRepository } from '@/repositories/activity-log.repository';

export class ActivityLogService {
  async getRecent(limit = 50) {
    return activityLogRepository.findRecent(limit);
  }
}

export const activityLogService = new ActivityLogService();
