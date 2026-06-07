import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';
import { isNotificationPermissionGranted } from '@/services/notifications/permission-utils';
import { registerForNotifications } from '@/services/notifications/local-notifications.service';
import { reminderService } from '@/services/reminder/reminder.service';

export const NotificationSettingsScreen = () => {
  const notificationPrefs = useProfileStore((s) => s.notificationPrefs);
  const updateNotificationPrefs = useProfileStore((s) => s.updateNotificationPrefs);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [checking, setChecking] = useState(true);

  const refreshPermission = useCallback(async () => {
    const status = await Notifications.getPermissionsAsync();
    setPermissionGranted(isNotificationPermissionGranted(status));
    setChecking(false);
  }, []);

  useEffect(() => {
    void refreshPermission();
  }, [refreshPermission]);

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await registerForNotifications();
      setPermissionGranted(granted);
      updateNotificationPrefs({ pushNotifications: granted, birthdayAlerts: granted });
      if (granted) {
        await reminderService.rescheduleAll();
      }
      return;
    }

    updateNotificationPrefs({ pushNotifications: false, birthdayAlerts: false });
  };

  const openSystemSettings = () => {
    void Linking.openSettings();
  };

  const statusLabel = checking
    ? 'Checking…'
    : permissionGranted
      ? 'Enabled on this device'
      : 'Disabled on this device';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Notification Settings</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-[14px] text-foreground-secondary leading-6 mb-5">
          Control birthday reminders and alerts. When enabled, we will notify you based on your reminder schedule.
        </Text>

        <View className="bg-surface rounded-2xl px-4 py-1 mb-4">
          <View className="flex-row items-center py-4">
            <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <Bell size={18} color="#7C3AED" />
            </View>
            <View className="flex-1 mr-3">
              <Text className="text-[15px] font-medium text-foreground">Birthday notifications</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">{statusLabel}</Text>
            </View>
            <Switch
              value={permissionGranted && notificationPrefs.pushNotifications}
              onValueChange={(value) => void handleToggle(value)}
              trackColor={{ false: '#E5E7EB', true: '#C4B5FD' }}
              thumbColor={permissionGranted && notificationPrefs.pushNotifications ? '#7C3AED' : '#F9FAFB'}
              accessibilityLabel="Toggle birthday notifications"
            />
          </View>
        </View>

        {!permissionGranted ? (
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

        <Pressable
          onPress={() => router.push('/reminder-settings')}
          className="mt-4 bg-surface rounded-2xl px-4 py-4"
          accessibilityRole="button"
          accessibilityLabel="Open reminder settings">
          <Text className="text-[15px] font-medium text-foreground">Reminder schedule</Text>
          <Text className="text-[12px] text-foreground-secondary mt-1">
            Choose when and how often you receive birthday reminders.
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
