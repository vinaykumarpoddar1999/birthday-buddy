import { Bell } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { scheduleEngagementReminder } from '@/services/notifications/engagement-reminder.service';
import { registerForNotifications } from '@/services/notifications/notification-init.utils';
import { getNotificationsModule, isExpoGoNotifications } from '@/services/notifications/notifications-api';
import { isNotificationPermissionGranted } from '@/services/notifications/permission-utils';
import { reminderService } from '@/services/reminder/reminder.service';
import { ScreenBackButton } from '@/shared/ui/ScreenBackButton';

import { useProfileStore } from '../store/profile.store';

export const NotificationSettingsScreen = () => {
  const notificationPrefs = useProfileStore((s) => s.notificationPrefs);
  const updateNotificationPrefs = useProfileStore((s) => s.updateNotificationPrefs);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [moduleUnavailable, setModuleUnavailable] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refreshPermission = useCallback(async (forceReload = false) => {
    setLoadError(null);
    setModuleUnavailable(false);
    try {
      const Notifications = await getNotificationsModule(forceReload);
      if (!Notifications) {
        setPermissionGranted(false);
        setModuleUnavailable(true);
        return;
      }

      const status = await Notifications.getPermissionsAsync();
      setPermissionGranted(isNotificationPermissionGranted(status));
    } catch {
      setPermissionGranted(false);
      setLoadError('Could not check notification permissions. Please try again.');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void refreshPermission();
  }, [refreshPermission]);

  const handleToggle = async (enabled: boolean) => {
    if (busy) return;
    setBusy(true);
    setLoadError(null);
    try {
      if (enabled) {
        const Notifications = await getNotificationsModule(true);
        if (!Notifications) {
          setModuleUnavailable(true);
          updateNotificationPrefs({ pushNotifications: false, birthdayAlerts: false });
          return;
        }

        const granted = await registerForNotifications();
        setPermissionGranted(granted);
        updateNotificationPrefs({ pushNotifications: granted, birthdayAlerts: granted });
        if (granted) {
          await reminderService.rescheduleAll();
          await scheduleEngagementReminder();
        }
        return;
      }

      updateNotificationPrefs({ pushNotifications: false, birthdayAlerts: false });
    } catch {
      setLoadError('Failed to update notification settings. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const openSystemSettings = () => {
    void Linking.openSettings();
  };

  const statusLabel = checking
    ? 'Checking…'
    : moduleUnavailable
      ? 'Requires a development or production build'
      : permissionGranted
        ? 'Enabled on this device'
        : 'Disabled on this device';

  const switchValue = moduleUnavailable
    ? notificationPrefs.pushNotifications
    : permissionGranted && notificationPrefs.pushNotifications;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <ScreenBackButton className="border-0 bg-transparent" />
        <Text className="text-title text-foreground font-bold">Notification Settings</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-[14px] text-foreground-secondary leading-6 mb-5">
          Control birthday reminders and alerts. When enabled, we will notify you based on your reminder schedule.
        </Text>

        {loadError ? (
          <View className="bg-red-50 rounded-2xl px-4 py-3 mb-4 border border-red-100">
            <Text className="text-[13px] text-red-700">{loadError}</Text>
            <Pressable
              onPress={() => {
                setChecking(true);
                void refreshPermission(true);
              }}
              className="mt-2"
              accessibilityRole="button"
              accessibilityLabel="Retry loading notification settings">
              <Text className="text-[13px] font-semibold text-red-600">Tap to retry</Text>
            </Pressable>
          </View>
        ) : null}

        {moduleUnavailable && !loadError ? (
          <View className="bg-amber-50 rounded-2xl px-4 py-3 mb-4 border border-amber-100">
            <Text className="text-[13px] text-amber-800">
              {isExpoGoNotifications()
                ? 'Push notifications are limited in Expo Go. Install a preview or production build to test reminders on this device.'
                : 'Notification services are temporarily unavailable. Your preferences are saved and will apply when notifications are available.'}
            </Text>
          </View>
        ) : null}

        <View className="bg-surface rounded-2xl px-4 py-1 mb-4">
          <View className="flex-row items-center py-4">
            <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <Bell size={18} color="#7C3AED" />
            </View>
            <View className="flex-1 mr-3">
              <Text className="text-[15px] font-medium text-foreground">Birthday notifications</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">{statusLabel}</Text>
            </View>
            {checking || busy ? (
              <ActivityIndicator size="small" color="#7C3AED" />
            ) : (
              <Switch
                value={switchValue}
                onValueChange={(value) => void handleToggle(value)}
                trackColor={{ false: '#E5E7EB', true: '#C4B5FD' }}
                thumbColor={switchValue ? '#7C3AED' : '#F9FAFB'}
                accessibilityLabel="Toggle birthday notifications"
              />
            )}
          </View>
        </View>

        {!permissionGranted && !checking && !moduleUnavailable ? (
          <Pressable
            onPress={openSystemSettings}
            className="bg-primary/10 rounded-2xl px-4 py-4"
            accessibilityRole="button"
            accessibilityLabel="Open device notification settings">
            <Text className="text-[14px] font-semibold text-primary">Open device settings</Text>
            <Text className="text-[12px] text-foreground-secondary mt-1 leading-5">
              If notifications are blocked, enable them in your phone settings for Birthday Buddy.
            </Text>
          </Pressable>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
};
