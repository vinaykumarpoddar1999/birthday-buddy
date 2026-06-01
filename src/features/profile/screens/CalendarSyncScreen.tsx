import { router } from 'expo-router';
import { Apple, ArrowLeft, Calendar, Mail } from 'lucide-react-native';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFeedback } from '@/shared/hooks/useFeedback';

import { useProfileStore } from '../store/profile.store';
import type { CalendarSyncSettings } from '../types';

type ProviderKey = keyof CalendarSyncSettings;

const PROVIDERS: { key: ProviderKey; title: string; desc: string; icon: typeof Calendar; color: string; bg: string }[] = [
  { key: 'google', title: 'Google Calendar', desc: 'Sync birthdays with Google Calendar', icon: Calendar, color: '#4285F4', bg: '#DBEAFE' },
  { key: 'apple', title: 'Apple Calendar', desc: 'Sync with iCloud Calendar', icon: Apple, color: '#111827', bg: '#F3F4F6' },
  { key: 'outlook', title: 'Outlook Calendar', desc: 'Sync with Microsoft Outlook', icon: Mail, color: '#0078D4', bg: '#DBEAFE' },
];

export const CalendarSyncScreen = () => {
  const calendarSync = useProfileStore((s) => s.calendarSync);
  const updateCalendarSync = useProfileStore((s) => s.updateCalendarSync);
  const { toast } = useFeedback();

  const toggleProvider = (key: ProviderKey, enabled: boolean) => {
    updateCalendarSync({
      [key]: {
        ...calendarSync[key],
        enabled,
        lastSyncAt: enabled ? new Date().toISOString() : calendarSync[key].lastSyncAt,
      },
    });
    toast(`${PROVIDERS.find((p) => p.key === key)?.title} ${enabled ? 'enabled' : 'disabled'}`, 'success');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Calendar Sync</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[13px] text-foreground-secondary mt-2 mb-4">
          Configure calendar sync preferences. Full OAuth integration coming in a future update.
        </Text>

        <View className="bg-surface rounded-2xl px-4 border border-border/60">
          {PROVIDERS.map((item, i) => (
            <View key={item.key}>
              {i > 0 && <View className="h-[0.5px] bg-border/60 ml-12" />}
              <View className="flex-row items-center py-3.5">
                <View className="h-9 w-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: item.bg }}>
                  <item.icon size={18} color={item.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-medium text-foreground">{item.title}</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5">{item.desc}</Text>
                  {calendarSync[item.key].lastSyncAt && calendarSync[item.key].enabled && (
                    <Text className="text-[10px] text-primary mt-0.5">
                      Last sync: {new Date(calendarSync[item.key].lastSyncAt!).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                <Switch
                  value={calendarSync[item.key].enabled}
                  onValueChange={(v) => toggleProvider(item.key, v)}
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
