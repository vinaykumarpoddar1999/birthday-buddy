import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, User } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { EmptyState } from '@shared/ui/EmptyState';
import { useNotificationStore } from '@/stores/notification.store';
import type { AppNotification } from '../types';

const TYPE_ICONS: Partial<Record<AppNotification['type'], LucideIcon>> = {
  birthday: Calendar,
  reminder: Calendar,
  wish: Calendar,
  card: Calendar,
  system: Calendar,
};

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const NotificationDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const notificationId = typeof id === 'string' ? id : '';
  const notification = useNotificationStore((s) =>
    notificationId ? s.notifications.find((n) => n.id === notificationId) : undefined,
  );
  const markAsRead = useNotificationStore((s) => s.markAsRead);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  const handleAction = () => {
    if (!notification?.personId) return;
    router.push({ pathname: '/person-details', params: { personId: notification.personId } });
  };

  if (!notification) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-row items-center px-5 py-3">
          <Pressable
            onPress={() => router.back()}
            className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
            accessibilityRole="button">
            <ArrowLeft size={20} color="#111827" />
          </Pressable>
          <Text className="text-title text-foreground font-bold">Notification</Text>
        </View>
        <EmptyState icon={Calendar} title="Not found" subtitle="This notification may have been removed." className="pt-12" />
      </SafeAreaView>
    );
  }

  const Icon = TYPE_ICONS[notification.type] ?? Calendar;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3 border-b border-border/40">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Notification</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32 pt-4">
        <View className="bg-surface rounded-2xl p-4 border border-border/60">
          <View className="flex-row items-start mb-3">
            <View className="h-11 w-11 rounded-xl bg-primary/10 items-center justify-center mr-3">
              <Icon size={22} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[18px] font-bold text-foreground">{notification.title}</Text>
              <Text className="text-[11px] text-foreground-secondary mt-1">{formatTimestamp(notification.timestamp)}</Text>
            </View>
          </View>
          <Text className="text-[15px] text-foreground leading-6">{notification.message}</Text>
        </View>

        {notification.personId ? (
          <Pressable
            className="bg-primary rounded-2xl py-4 mt-6 items-center flex-row justify-center gap-2"
            onPress={handleAction}
            accessibilityRole="button"
            accessibilityLabel="View person">
            <User size={18} color="#FFFFFF" />
            <Text className="text-[15px] font-bold text-white">View Person</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
