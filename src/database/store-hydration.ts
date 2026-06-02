import { useActivityStore } from '@features/profile/store/activity.store';
import { hydrateProfileDomains } from '@features/profile/store/profile.store';
import { useCardStudioStore } from '@features/card-studio/store/card-studio.store';
import { useThemeStore } from '@/stores/theme.store';
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

async function hydrateAuthStoreSafely(): Promise<void> {
  try {
    const { useAuthStore } = await import('@/stores/auth.store');
    await useAuthStore.getState().hydrate();
  } catch {
    const { useAuthStore } = await import('@/stores/auth.store');
    useAuthStore.setState({
      authState: 'setup_required',
      isHydrated: true,
      isLocked: false,
      hasAccount: false,
      onboardingComplete: false,
    });
  }
}

async function loadStoreData() {
  return Promise.all([
    profileService.load(),
    appNotificationService.list(),
    activityDisplayService.getActivityFeed(),
    profileService.getRecentSearches(),
    cardStudioPrefsService.load(),
    cardStudioPrefsService.loadAiTemplates(),
    feedbackService.list(),
    birthdayService.getHomeInsights(),
  ]);
}

export async function hydrateAppStores(): Promise<void> {
  try {
    await appNotificationService.seedWelcomeIfEmpty();
  } catch {
    // Non-blocking welcome seed.
  }

  let profileBundle: Awaited<ReturnType<typeof profileService.load>>;
  let notifications: Awaited<ReturnType<typeof appNotificationService.list>>;
  let activities: Awaited<ReturnType<typeof activityDisplayService.getActivityFeed>>;
  let recentSearches: string[];
  let cardPrefs: Awaited<ReturnType<typeof cardStudioPrefsService.load>>;
  let aiTemplates: Awaited<ReturnType<typeof cardStudioPrefsService.loadAiTemplates>>;
  let feedbacks: Awaited<ReturnType<typeof feedbackService.list>>;
  let homeInsights: Awaited<ReturnType<typeof birthdayService.getHomeInsights>>;

  try {
    [
      profileBundle,
      notifications,
      activities,
      recentSearches,
      cardPrefs,
      aiTemplates,
      feedbacks,
      homeInsights,
    ] = await loadStoreData();
  } catch {
    const fallback = await profileService.load().catch(async () => ({
      ...(await import('@/services/profile/profile.service')).DEFAULT_PROFILE_BUNDLE,
      profileCompletion: 0,
    }));
    profileBundle = fallback;
    notifications = [];
    activities = [];
    recentSearches = [];
    cardPrefs = { favoriteTemplateIds: [], recentTemplateIds: [], drafts: [] };
    aiTemplates = [];
    feedbacks = [];
    homeInsights = { remindersToday: 0, streakDays: 0, upcomingThisWeek: 0 };
  }

  hydrateProfileDomains(profileBundle);

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

  try {
    const { syncDeviceCalendarIfEnabled } = await import('@/services/calendar/device-calendar.service');
    await syncDeviceCalendarIfEnabled();
  } catch {
    /* calendar sync on startup is best-effort */
  }

  try {
    const refreshedNotifications = await appNotificationService.list();
    useNotificationStore.getState().hydrateNotifications(refreshedNotifications);
    useActivityStore.setState({ notifications: refreshedNotifications });
  } catch {
    // Keep previously loaded notifications.
  }

  await hydrateAuthStoreSafely();
}
