import { hydrateAppStores } from '@/database/store-hydration';
import { DatabaseManager } from '@/database/database-manager';
import { cancelAllScheduledBirthdayNotifications } from '@/services/notifications/local-notifications.service';
import { profileService } from '@/services/profile/profile.service';
import { appNotificationService } from '@/services/notifications/app-notification.service';

const WIPE_TABLES = [
  'wish_history',
  'ai_wishes',
  'reminders',
  'events',
  'people',
  'cards',
  'notifications',
  'activity_logs',
  'feedbacks',
  'backup_history',
  'export_history',
  'card_history',
] as const;

export class AccountService {
  async wipeLocalData(): Promise<void> {
    await cancelAllScheduledBirthdayNotifications();
    await DatabaseManager.withTransaction(async () => {
      for (const table of WIPE_TABLES) {
        await DatabaseManager.run(`DELETE FROM ${table}`);
      }
    });
    await profileService.resetToDefaults();
    await appNotificationService.clearAll();
    await appNotificationService.seedWelcomeIfEmpty();
    await hydrateAppStores();
  }
}

export const accountService = new AccountService();
