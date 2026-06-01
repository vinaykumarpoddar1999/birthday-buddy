import { activityLogRepository } from '@/repositories/activity-log.repository';
import type { ActivityEntry } from '@features/profile/types';

const ACTION_LABELS: Record<string, { type: ActivityEntry['type']; title: string }> = {
  created_person: { type: 'person_added', title: 'Added Person' },
  updated_person: { type: 'person_edited', title: 'Updated Person' },
  deleted_person: { type: 'person_deleted', title: 'Deleted Person' },
  generated_wish: { type: 'wish_generated', title: 'Generated AI Wish' },
  created_card: { type: 'card_created', title: 'Created Card' },
  shared_card: { type: 'card_shared', title: 'Shared Card' },
  settings_changed: { type: 'reminder_set', title: 'Settings Updated' },
};

export class ActivityDisplayService {
  async getActivityFeed(limit = 50): Promise<ActivityEntry[]> {
    const rows = await activityLogRepository.findRecent(limit);
    return rows.map((row) => {
      const meta = row.metadata ? (JSON.parse(row.metadata) as Record<string, string>) : {};
      const mapped = ACTION_LABELS[row.action] ?? {
        type: 'reminder_set' as const,
        title: row.action.replace(/_/g, ' '),
      };
      return {
        id: row.uuid,
        type: mapped.type,
        title: mapped.title,
        description: meta.description ?? row.action.replace(/_/g, ' '),
        timestamp: row.createdAt,
        personId: row.entityUuid ?? undefined,
        personName: meta.personName,
        metadata: meta,
      };
    });
  }
}

export const activityDisplayService = new ActivityDisplayService();
