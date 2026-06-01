import { useCardStudioStore } from '@features/card-studio/store/card-studio.store';
import { useActivityStore } from '@features/profile/store/activity.store';
import { useProfileStore } from '@features/profile/store/profile.store';
import { useAIWishesStore } from '@features/ai-wishes/store/ai-wishes.store';
import { useThemeStore } from '@/stores/theme.store';

import { activityDisplayService } from '@/services/activity/activity-display.service';
import { cardStudioPrefsService } from '@/services/card/card-studio-prefs.service';
import { appNotificationService } from '@/services/notifications/app-notification.service';
import { initializeNotificationSystem } from '@/services/notifications/notification-scheduler.service';
import { profileService } from '@/services/profile/profile.service';

import { feedbackService } from '@/services/feedback/feedback.service';

export async function hydrateAppStores(): Promise<void> {
  await appNotificationService.seedWelcomeIfEmpty();

  const [profileBundle, notifications, activities, recentSearches, cardPrefs, aiTemplates, feedbacks] =
    await Promise.all([
      profileService.load(),
      appNotificationService.list(),
      activityDisplayService.getActivityFeed(),
      profileService.getRecentSearches(),
      cardStudioPrefsService.load(),
      cardStudioPrefsService.loadAiTemplates(),
      feedbackService.list(),
    ]);

  useProfileStore.setState({
    profile: profileBundle.profile,
    language: profileBundle.language,
    currency: profileBundle.currency,
    theme: profileBundle.theme,
    appIcon: profileBundle.appIcon,
    hapticFeedback: profileBundle.hapticFeedback,
    notificationPrefs: profileBundle.notificationPrefs,
    reminderSettings: profileBundle.reminderSettings,
    privacySettings: profileBundle.privacySettings,
    backupSettings: profileBundle.backupSettings,
    appearanceSettings: profileBundle.appearanceSettings,
    calendarSync: profileBundle.calendarSync,
    appRating: profileBundle.appRating,
    profileCompletion: profileBundle.profileCompletion,
  });

  useAIWishesStore.setState({
    credits: profileBundle.aiCredits,
    savedTemplates: aiTemplates,
  });

  useCardStudioStore.setState({
    favoriteTemplateIds: cardPrefs.favoriteTemplateIds,
    recentTemplateIds: cardPrefs.recentTemplateIds,
    drafts: cardPrefs.drafts,
  });

  useThemeStore.setState({ mode: profileBundle.theme });

  useActivityStore.setState({
    notifications,
    activities,
    recentSearches,
    feedbacks,
  });

  await initializeNotificationSystem();

  const refreshedNotifications = await appNotificationService.list();
  useActivityStore.setState({ notifications: refreshedNotifications });
}
