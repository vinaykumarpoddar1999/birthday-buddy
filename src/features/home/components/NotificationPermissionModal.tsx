import * as Notifications from 'expo-notifications';
import { Bell, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Modal, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { registerForNotifications } from '@/services/notifications/local-notifications.service';
import { isNotificationPermissionGranted } from '@/services/notifications/permission-utils';
import { reminderService } from '@/services/reminder/reminder.service';

const PROMPT_DELAY_MS = 30_000;

type NotificationPermissionModalProps = {
  active: boolean;
};

export function NotificationPermissionModal({ active }: NotificationPermissionModalProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissedRef = useRef(false);

  const checkAndMaybeShow = useCallback(async () => {
    if (!active || dismissedRef.current) return;
    const status = await Notifications.getPermissionsAsync();
    if (isNotificationPermissionGranted(status)) return;
    setVisible(true);
  }, [active]);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      void checkAndMaybeShow();
    }, PROMPT_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, checkAndMaybeShow]);

  const handleDismiss = () => {
    dismissedRef.current = true;
    setVisible(false);
  };

  const handleEnable = async () => {
    const granted = await registerForNotifications();
    if (granted) {
      await reminderService.rescheduleAll();
      setVisible(false);
      return;
    }
    void Linking.openSettings();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View className="flex-1 bg-black/45 justify-end px-5 pb-10">
        <Animated.View entering={FadeInDown.duration(350)} className="rounded-3xl overflow-hidden bg-surface">
          <LinearGradient colors={['#EDE9FE', '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View className="px-5 pt-5 pb-4">
              <View className="flex-row items-start justify-between">
                <View className="h-12 w-12 rounded-2xl bg-primary items-center justify-center">
                  <Bell size={22} color="#FFFFFF" />
                </View>
                <Pressable
                  onPress={handleDismiss}
                  className="h-8 w-8 rounded-full bg-background/80 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss notification prompt">
                  <X size={16} color="#6B7280" />
                </Pressable>
              </View>
              <Animated.Text entering={FadeIn.delay(100)} className="text-[20px] font-bold text-foreground mt-4">
                Never miss a birthday
              </Animated.Text>
              <Text className="text-[14px] text-foreground-secondary leading-6 mt-2">
                Turn on notifications to get friendly reminders before the celebrations that matter most.
              </Text>
            </View>
          </LinearGradient>

          <View className="px-5 py-4 gap-3">
            <Pressable
              onPress={() => void handleEnable()}
              className="bg-primary rounded-2xl py-4 items-center"
              accessibilityRole="button"
              accessibilityLabel="Enable notifications">
              <Text className="text-white font-bold text-[15px]">Enable Notifications</Text>
            </Pressable>
            <Pressable
              onPress={handleDismiss}
              className="py-3 items-center"
              accessibilityRole="button"
              accessibilityLabel="Not now">
              <Text className="text-[14px] font-semibold text-foreground-secondary">Not now</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
