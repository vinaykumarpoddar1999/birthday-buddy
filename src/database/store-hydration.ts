import { useActivityStore } from '@features/profile/store/activity.store';
import { useAIWishesStore } from '@features/ai-wishes/store/ai-wishes.store';
import { hydrateProfileDomains } from '@features/profile/store/profile.store';
import { useCardStudioStore } from '@features/card-studio/store/card-studio.store';
import { useThemeStore } from '@/stores/theme.store';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useBirthdayStore } from '@/stores/birthday.store';

import { activityDisplayService } from '@/services/activity/activity-display.service';
import { cardStudioPrefsService } from '@/services/card/card-studio-prefs.service';
import { appNotificationService } from '@/services/notifications/app-notification.service';
import { initializeBackupScheduler } from '@/services/backup/backup-scheduler.service';
import { initializeNotificationSystem } from '@/services/notifications/notification-scheduler.service';
import { profileService } from '@/services/profile/profile.service';
import { birthdayService } from '@/services/birthday/birthday.service';
import { feedbackService } from '@/services/feedback/feedback.service';

export async function hydrateAppStores(): Promise<void> {
  await appNotificationService.seedWelcomeIfEmpty();

  const [profileBundle, notifications, activities, recentSearches, cardPrefs, aiTemplates, feedbacks, homeInsights] =
    await Promise.all([
      profileService.load(),
      appNotificationService.list(),
      activityDisplayService.getActivityFeed(),
      profileService.getRecentSearches(),
      cardStudioPrefsService.load(),
      cardStudioPrefsService.loadAiTemplates(),
      feedbackService.list(),
      birthdayService.getHomeInsights(),
    ]);

  hydrateProfileDomains(profileBundle);

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

  useNotificationStore.getState().hydrateNotifications(notifications);

  useActivityStore.setState({
    activities,
    recentSearches,
    feedbacks,
    notifications,
    markAsRead: useNotificationStore.getState().markAsRead,
    markAllAsRead: useNotificationStore.getState().markAllAsRead,
    deleteNotification: useNotificationStore.getState().deleteNotification,
    clearAllNotifications: useNotificationStore.getState().clearAllNotifications,
    addNotification: useNotificationStore.getState().addNotification,
    getUnreadCount: useNotificationStore.getState().getUnreadCount,
  });

  useBirthdayStore.getState().setInsights({
    remindersToday: homeInsights.remindersToday,
    streakDays: homeInsights.streakDays,
    upcomingThisWeek: homeInsights.upcomingThisWeek,
  });

  try {
    await initializeNotificationSystem();
  } catch {
    // Notification bootstrap is optional; store hydration must still complete.
  }

  try {
    await initializeBackupScheduler();
  } catch {
    /* background backup registration is optional */
  }

  const refreshedNotifications = await appNotificationService.list();
  useNotificationStore.getState().hydrateNotifications(refreshedNotifications);
  useActivityStore.setState({ notifications: refreshedNotifications });

  await useAuthStore.getState().hydrate();
}
