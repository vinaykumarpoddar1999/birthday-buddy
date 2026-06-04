import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlarmClock, BellOff, Cake, Clock } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  parseAlarmPayload,
  snoozeBirthdayAlarm,
  SNOOZE_ACTION_ID,
  useBirthdayAlarmStore,
} from '@/services/notifications/birthday-alarm.service';
import { getNotificationsModule } from '@/services/notifications/notifications-api';
import { ensureNotificationHandler } from '@/services/notifications/notification-init.utils';
import { displayFullScreenBirthdayAlarm } from '@/services/notifications/notifee-alarm.service';
import { ConfettiBurst } from '@/shared/ui/ConfettiBurst';

function formatClockTime(): string {
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  return `${h}:${m} ${ampm}`;
}

export function BirthdayAlarmHost() {
  const active = useBirthdayAlarmStore((s) => s.active);
  const dismiss = useBirthdayAlarmStore((s) => s.dismiss);
  const showOverlay = useBirthdayAlarmStore((s) => s.showOverlay);
  const pulse = useSharedValue(1);
  const [clockLabel, setClockLabel] = useState(formatClockTime);

  useEffect(() => {
    const interval = setInterval(() => setClockLabel(formatClockTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(withTiming(1.12, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      false,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  useEffect(() => {
    let receivedSub: { remove: () => void } | undefined;
    let responseSub: { remove: () => void } | undefined;

    void (async () => {
      await ensureNotificationHandler();
      const Notifications = await getNotificationsModule();
      if (!Notifications) return;

      receivedSub = Notifications.addNotificationReceivedListener((notification) => {
        const alarm = parseAlarmPayload(
          notification.request.content.data as Record<string, unknown> | undefined,
        );
        if (alarm) {
          if (Platform.OS === 'android') {
            void displayFullScreenBirthdayAlarm(alarm.contactId, alarm.contactName);
          }
          showOverlay(alarm);
        }
      });

      responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as Record<string, unknown>;
        const alarm = parseAlarmPayload(data);
        const actionId = response.actionIdentifier;

        if (actionId === SNOOZE_ACTION_ID && alarm) {
          void snoozeBirthdayAlarm(alarm.contactId, alarm.contactName);
          return;
        }

        if (alarm) showOverlay(alarm);
      });
    })();

    return () => {
      receivedSub?.remove();
      responseSub?.remove();
    };
  }, [showOverlay]);

  if (!active) return null;

  return (
    <Modal visible animationType="fade" statusBarTranslucent>
      <LinearGradient
        colors={['#4C1D95', '#7C3AED', '#DB2777', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}>
        <ConfettiBurst active durationMs={8000} count={140} />
        <View className="flex-1 justify-center px-8">
          <Animated.View style={pulseStyle} className="items-center">
            <View className="h-24 w-24 rounded-full bg-white/20 items-center justify-center border-2 border-white/50 mb-6">
              <AlarmClock size={48} color="#FFF" />
            </View>
            <Text className="text-[56px] font-bold text-white tracking-tight">{clockLabel}</Text>
            <Text className="text-[13px] font-bold text-white/80 uppercase tracking-[4px] mt-2">
              Birthday Alarm
            </Text>
            <View className="flex-row items-center gap-2 mt-6 bg-white/15 rounded-full px-5 py-3">
              <Cake size={20} color="#FDE68A" />
              <Text className="text-[22px] font-bold text-white text-center">{active.contactName}</Text>
            </View>
            <Text className="text-[16px] text-white/90 text-center mt-4 leading-6">
              It&apos;s time to celebrate! Send your warmest birthday wish now.
            </Text>
          </Animated.View>

          <View className="mt-12 gap-3">
            <Pressable
              onPress={() => dismiss()}
              className="overflow-hidden rounded-2xl"
              accessibilityRole="button"
              accessibilityLabel="Dismiss alarm">
              <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View className="flex-row items-center justify-center py-4 gap-2">
                  <BellOff size={20} color="#FFF" />
                  <Text className="text-[17px] font-bold text-white">Dismiss</Text>
                </View>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => void snoozeBirthdayAlarm(active.contactId, active.contactName)}
              className="flex-row items-center justify-center py-4 gap-2 rounded-2xl bg-white/20 border border-white/35"
              accessibilityRole="button"
              accessibilityLabel="Snooze one hour">
              <Clock size={20} color="#FFF" />
              <Text className="text-[16px] font-bold text-white">Snooze 1 hour</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
}
