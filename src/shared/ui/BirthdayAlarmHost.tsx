import { useEffect } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlarmClock, BellOff, Clock } from 'lucide-react-native';

import {
  parseAlarmPayload,
  snoozeBirthdayAlarm,
  SNOOZE_ACTION_ID,
  useBirthdayAlarmStore,
} from '@/services/notifications/birthday-alarm.service';
import { getNotificationsModule } from '@/services/notifications/notifications-api';
import { ensureNotificationHandler } from '@/services/notifications/notification-init.utils';

export function BirthdayAlarmHost() {
  const active = useBirthdayAlarmStore((s) => s.active);
  const dismiss = useBirthdayAlarmStore((s) => s.dismiss);
  const showOverlay = useBirthdayAlarmStore((s) => s.showOverlay);

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
        if (alarm) showOverlay(alarm);
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
    <Modal visible animationType="slide" transparent statusBarTranslucent>
      <View className="flex-1 bg-black/70 justify-center px-6">
        <View className="rounded-3xl overflow-hidden bg-surface">
          <LinearGradient
            colors={['#7C3AED', '#EC4899', '#F59E0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 28, alignItems: 'center' }}>
            <View className="h-16 w-16 rounded-full bg-white/25 items-center justify-center mb-4">
              <AlarmClock size={32} color="#FFF" />
            </View>
            <Text className="text-[13px] font-bold text-white/90 uppercase tracking-wider">
              Birthday Alarm
            </Text>
            <Text className="text-[26px] font-bold text-white text-center mt-2">
              {active.contactName}
            </Text>
            <Text className="text-[15px] text-white/90 text-center mt-2">
              It&apos;s time to send your birthday wish!
            </Text>
          </LinearGradient>

          <View className="p-5 gap-3">
            <Pressable
              onPress={() => dismiss()}
              className="overflow-hidden rounded-2xl"
              accessibilityRole="button"
              accessibilityLabel="Dismiss alarm">
              <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View className="flex-row items-center justify-center py-4 gap-2">
                  <BellOff size={18} color="#FFF" />
                  <Text className="text-[16px] font-bold text-white">Dismiss</Text>
                </View>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => void snoozeBirthdayAlarm(active.contactId, active.contactName)}
              className="flex-row items-center justify-center py-4 gap-2 rounded-2xl bg-primary/10 border border-primary/25"
              accessibilityRole="button"
              accessibilityLabel="Snooze one hour">
              <Clock size={18} color="#7C3AED" />
              <Text className="text-[15px] font-bold text-primary">Snooze 1 hour</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
