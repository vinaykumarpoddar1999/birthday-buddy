import { router } from 'expo-router';
import { Activity, ArrowLeft, Bell, BellRing, CheckCheck, Clock, Crown, Gift, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { EmptyState } from '@shared/ui/EmptyState';

import { useActivityStore } from '../store/activity.store';
import type { AppNotification } from '../types';

const FILTERS = ['All', 'Birthdays', 'Reminders', 'System'] as const;
type FilterType = (typeof FILTERS)[number];

const TYPE_CONFIG: Record<AppNotification['type'], { icon: LucideIcon; color: string; bg: string }> = {
  birthday: { icon: Gift, color: '#EC4899', bg: '#FCE7F3' },
  wish: { icon: BellRing, color: '#7C3AED', bg: '#EDE9FE' },
  reminder: { icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
  system: { icon: Bell, color: '#3B82F6', bg: '#DBEAFE' },
  premium: { icon: Crown, color: '#F59E0B', bg: '#FEF3C7' },
  activity: { icon: Activity, color: '#22C55E', bg: '#DCFCE7' },
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
  const notifications = useActivityStore((s) => s.notifications);
  const markAsRead = useActivityStore((s) => s.markAsRead);
  const markAllAsRead = useActivityStore((s) => s.markAllAsRead);
  const deleteNotification = useActivityStore((s) => s.deleteNotification);
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return notifications;
    const map: Record<string, string[]> = {
      Birthdays: ['birthday'],
      Reminders: ['reminder', 'wish'],
      System: ['system', 'premium', 'activity'],
    };
    const types = map[filter] ?? [];
    return notifications.filter((n) => types.includes(n.type));
  }, [notifications, filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Notifications</Text>
        {unreadCount > 0 && (
          <Pressable onPress={markAllAsRead} className="flex-row items-center gap-1" accessibilityRole="button">
            <CheckCheck size={16} color="#7C3AED" />
            <Text className="text-[12px] font-bold text-primary">Mark All Read</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-3" contentContainerClassName="gap-2">
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 border ${filter === f ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
            accessibilityRole="button">
            <Text className={`text-[12px] font-semibold ${filter === f ? 'text-white' : 'text-foreground-secondary'}`}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            subtitle="You are all caught up!"
            className="pt-12"
          />
        ) : (
          filtered.map((n) => {
            const config = TYPE_CONFIG[n.type];
            const Icon = config.icon;
            return (
              <Pressable
                key={n.id}
                className={`bg-surface rounded-xl p-3.5 mb-2 border flex-row ${n.isRead ? 'border-border/60' : 'border-l-4 border-primary border-t-border/60 border-r-border/60 border-b-border/60'}`}
                onPress={() => { if (!n.isRead) markAsRead(n.id); }}
                accessibilityRole="button">
                <View className="h-9 w-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: config.bg }}>
                  <Icon size={18} color={config.color} />
                </View>
                <View className="flex-1">
                  <Text className={`text-[14px] font-semibold text-foreground ${!n.isRead ? 'font-bold' : ''}`}>{n.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5" numberOfLines={2}>{n.message}</Text>
                  <Text className="text-[10px] text-foreground-secondary/60 mt-1">{getRelativeTime(n.timestamp)}</Text>
                </View>
                <Pressable onPress={() => deleteNotification(n.id)} className="ml-2 p-1" accessibilityRole="button" accessibilityLabel="Delete notification">
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
