import { router } from 'expo-router';
import { ArrowLeft, Bell, BellRing, Calendar, Gift, Monitor } from 'lucide-react-native';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';

import { useProfileStore } from '../store/profile.store';
import type { NotificationPreferences } from '../types';

type ToggleItem = {
  key: keyof NotificationPreferences;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

const TOGGLES: ToggleItem[] = [
  { key: 'pushNotifications', title: 'Push Notifications', desc: 'Receive push notifications on your device', icon: Bell, color: '#7C3AED', bg: '#EDE9FE' },
  { key: 'birthdayAlerts', title: 'Birthday Alerts', desc: 'Get notified about upcoming birthdays', icon: BellRing, color: '#EF4444', bg: '#FEE2E2' },
  { key: 'wishSuggestions', title: 'Wish Suggestions', desc: 'AI-generated wish recommendations', icon: Gift, color: '#EC4899', bg: '#FCE7F3' },
  { key: 'specialEventAlerts', title: 'Special Event Alerts', desc: 'Anniversaries, weddings, and custom events', icon: Calendar, color: '#3B82F6', bg: '#DBEAFE' },
  { key: 'systemNotifications', title: 'System Notifications', desc: 'App updates and announcements', icon: Monitor, color: '#F59E0B', bg: '#FEF3C7' },
];

export const NotificationPrefsScreen = () => {
  const prefs = useProfileStore((s) => s.notificationPrefs);
  const update = useProfileStore((s) => s.updateNotificationPrefs);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Notification Preferences</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">Choose what notifications you want to receive.</Text>

        <View className="bg-surface rounded-2xl px-4 border border-border/60">
          {TOGGLES.map((item, i) => (
            <View key={item.key}>
              {i > 0 && <View className="h-[0.5px] bg-border/60 ml-12" />}
              <View className="flex-row items-center py-3.5">
                <View className="h-9 w-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: item.bg }}>
                  <item.icon size={18} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-medium text-foreground">{item.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5">{item.desc}</Text>
                </View>
                <Switch
                  value={prefs[item.key]}
                  onValueChange={(v) => update({ [item.key]: v })}
                  trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
