import { router } from 'expo-router';
import { ArrowLeft, Bell, ClipboardList, Download, Palette, Pencil, Share2, Sparkles, Trash2, UserPlus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { EmptyState } from '@shared/ui/EmptyState';

import { useActivityStore } from '../store/activity.store';
import type { ActivityEntry } from '../types';

const FILTERS = ['All', 'Wishes', 'Cards', 'People', 'Reminders'] as const;
type FilterType = (typeof FILTERS)[number];

const TYPE_CONFIG: Record<ActivityEntry['type'], { icon: LucideIcon; color: string; bg: string }> = {
  wish_generated: { icon: Sparkles, color: '#7C3AED', bg: '#EDE9FE' },
  card_created: { icon: Palette, color: '#3B82F6', bg: '#DBEAFE' },
  person_added: { icon: UserPlus, color: '#22C55E', bg: '#DCFCE7' },
  person_edited: { icon: Pencil, color: '#F59E0B', bg: '#FEF3C7' },
  person_deleted: { icon: Trash2, color: '#EF4444', bg: '#FEE2E2' },
  reminder_set: { icon: Bell, color: '#F97316', bg: '#FFEDD5' },
  card_shared: { icon: Share2, color: '#14B8A6', bg: '#CCFBF1' },
  card_downloaded: { icon: Download, color: '#6366F1', bg: '#E0E7FF' },
};

const FILTER_MAP: Record<FilterType, ActivityEntry['type'][]> = {
  All: [],
  Wishes: ['wish_generated'],
  Cards: ['card_created', 'card_shared', 'card_downloaded'],
  People: ['person_added', 'person_edited', 'person_deleted'],
  Reminders: ['reminder_set'],
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

export const ActivityHistoryScreen = () => {
  const activities = useActivityStore((s) => s.activities);
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return activities;
    const types = FILTER_MAP[filter];
    return activities.filter((a) => types.includes(a.type));
  }, [activities, filter]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Activity History</Text>
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
            icon={ClipboardList}
            title="No activities"
            subtitle="Activities will appear here"
            className="pt-8"
          />
        ) : (
          filtered.map((activity) => {
            const config = TYPE_CONFIG[activity.type];
            const Icon = config.icon;
            return (
              <View key={activity.id} className="bg-surface rounded-xl p-3.5 mb-2 border border-border/60 flex-row">
                <View className="h-9 w-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: config.bg }}>
                  <Icon size={18} color={config.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-foreground">{activity.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5">{activity.description}</Text>
                  <Text className="text-[10px] text-foreground-secondary/60 mt-1">{getRelativeTime(activity.timestamp)}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
