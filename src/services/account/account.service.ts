import { hydrateAppStores } from '@/database/store-hydration';
import { DatabaseManager } from '@/database/database-manager';
import { setOnboardingComplete } from '@/lib/onboarding-storage';
import { cancelEveryScheduledNotification } from '@/services/notifications/local-notifications.service';
import { profileService } from '@/services/profile/profile.service';
import { appNotificationService } from '@/services/notifications/app-notification.service';
import { useAuthStore } from '@/stores/auth.store';

const WIPE_TABLES = [
  'surprise_replies',
  'surprise_reactions',
  'surprise_analytics',
  'surprise_experiences',
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
    await cancelEveryScheduledNotification();
    await DatabaseManager.withTransaction(async () => {
      for (const table of WIPE_TABLES) {
        await DatabaseManager.run(`DELETE FROM ${table}`);
      }
    });
    await setOnboardingComplete(false);
    await profileService.resetToDefaults();
    await appNotificationService.clearAll();
    await appNotificationService.seedWelcomeIfEmpty();
    await hydrateAppStores();
    useAuthStore.setState({
      authState: 'setup_required',
      onboardingComplete: false,
    });
  }
}

export const accountService = new AccountService();
