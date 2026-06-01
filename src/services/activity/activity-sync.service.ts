import { useActivityStore } from '@features/profile/store/activity.store';

import { activityDisplayService } from './activity-display.service';

/** Reload activity feed from SQLite into the UI store (call after CRUD). */
export async function refreshActivityFeed(): Promise<void> {
  const activities = await activityDisplayService.getActivityFeed();
  useActivityStore.setState({ activities });
}
