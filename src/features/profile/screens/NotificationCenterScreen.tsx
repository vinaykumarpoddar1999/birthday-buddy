import { router } from 'expo-router';
import { Activity, ArrowLeft, Bell, BellRing, CheckCheck, Clock, Crown, Gift, Palette, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { EmptyState } from '@shared/ui/EmptyState';
import { useFeedback } from '@/shared/hooks/useFeedback';

import { useNotificationStore } from '@/stores/notification.store';
import type { AppNotification } from '../types';

const FILTERS = ['All', 'Birthdays', 'Reminders', 'Wishes', 'Cards', 'System'] as const;
type FilterType = (typeof FILTERS)[number];

const TYPE_CONFIG: Partial<Record<AppNotification['type'], { icon: LucideIcon; color: string; bg: string }>> = {
  birthday: { icon: Gift, color: '#EC4899', bg: '#FCE7F3' },
  wish: { icon: BellRing, color: '#7C3AED', bg: '#EDE9FE' },
  reminder: { icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
  system: { icon: Bell, color: '#3B82F6', bg: '#DBEAFE' },
  premium: { icon: Crown, color: '#F59E0B', bg: '#FEF3C7' },
  activity: { icon: Activity, color: '#22C55E', bg: '#DCFCE7' },
  card: { icon: Palette, color: '#8B5CF6', bg: '#EDE9FE' },
};

const getRelativeTime = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const NotificationCenterScreen = () => {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);
  const clearAllNotifications = useNotificationStore((s) => s.clearAllNotifications);
  const [filter, setFilter] = useState<FilterType>('All');
  const { showDeleteConfirm } = useFeedback();

  const filtered = useMemo(() => {
    if (filter === 'All') return notifications;
    const map: Record<string, string[]> = {
      Birthdays: ['birthday'],
      Reminders: ['reminder'],
      Wishes: ['wish'],
      Cards: ['card'],
      System: ['system', 'premium', 'activity'],
    };
    const types = map[filter] ?? [];
    return notifications.filter((n) => types.includes(n.type));
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3 border-b border-border/40 bg-surface/80">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[20px] text-foreground font-bold">Notifications</Text>
          {unreadCount > 0 ? (
            <Text className="text-[11px] text-primary font-semibold mt-0.5">{unreadCount} unread</Text>
          ) : (
            <Text className="text-[11px] text-foreground-secondary mt-0.5">All caught up</Text>
          )}
        </View>
        {notifications.length > 0 && (
          <Pressable
            onPress={() =>
              showDeleteConfirm({
                title: 'Clear All',
                message: 'Delete all notifications?',
                onConfirm: clearAllNotifications,
              })
            }
            className="mr-2"
            accessibilityRole="button">
            <Trash2 size={18} color="#EF4444" />
          </Pressable>
        )}
        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead} className="flex-row items-center gap-1" accessibilityRole="button">
            <CheckCheck size={16} color="#7C3AED" />
            <Text className="text-[12px] font-bold text-primary">Read All</Text>
          </Pressable>
        )}
      </View>

      <View className="px-5 pb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, alignItems: 'center', paddingVertical: 4 }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={{
                height: 32,
                paddingHorizontal: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: filter === f ? '#7C3AED' : '#E5E7EB',
                backgroundColor: filter === f ? '#7C3AED' : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              accessibilityRole="button">
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: filter === f ? '#FFFFFF' : '#6B7280',
                  lineHeight: 16,
                }}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {unreadCount > 0 && (
          <View className="bg-primary/8 rounded-2xl px-4 py-3 mb-4 border border-primary/15 flex-row items-center">
            <View className="h-10 w-10 rounded-xl bg-primary/15 items-center justify-center mr-3">
              <BellRing size={20} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-bold text-foreground">{unreadCount} unread</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">Tap a notification to mark it read</Text>
            </View>
          </View>
        )}
        {filtered.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" subtitle="You are all caught up!" className="pt-12" />
        ) : (
          filtered.map((n) => {
            const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system ?? { icon: Bell, color: '#3B82F6', bg: '#DBEAFE' };
            const Icon = config.icon;
            return (
              <Pressable
                key={n.id}
                className={`bg-surface rounded-xl p-3.5 mb-2 border flex-row ${n.isRead ? 'border-border/60' : 'border-l-4 border-primary border-t-border/60 border-r-border/60 border-b-border/60'}`}
                onPress={() => {
                  router.push({ pathname: '/notification-detail', params: { id: n.id } });
                }}
                accessibilityRole="button">
                <View className="h-9 w-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: config.bg }}>
                  <Icon size={18} color={config.color} />
                </View>
                <View className="flex-1">
                  <Text className={`text-[14px] text-foreground ${!n.isRead ? 'font-bold' : 'font-semibold'}`}>{n.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5" numberOfLines={2}>
                    {n.message}
                  </Text>
                  <Text className="text-[10px] text-foreground-secondary/60 mt-1">{getRelativeTime(n.timestamp)}</Text>
                </View>
                <Pressable
                  onPress={() => deleteNotification(n.id)}
                  className="ml-2 p-1"
                  accessibilityRole="button"
                  accessibilityLabel="Delete notification">
                  <Trash2 size={14} color="#9CA3AF" />
                </Pressable>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
