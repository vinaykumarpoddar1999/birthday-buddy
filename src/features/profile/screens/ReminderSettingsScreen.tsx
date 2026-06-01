import { router } from 'expo-router';
import { ArrowLeft, Bell, Clock, Volume2, Vibrate } from 'lucide-react-native';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';
import type { ReminderSettings } from '../types';

const DAY_OPTIONS = [0, 1, 3, 7, 14];
const WEEKEND_RULES: { key: ReminderSettings['weekendRules']; label: string }[] = [
  { key: 'same', label: 'Same as weekdays' },
  { key: 'skip', label: 'Skip weekends' },
  { key: 'earlier', label: 'Remind Friday instead' },
];

export const ReminderSettingsScreen = () => {
  const settings = useProfileStore((s) => s.reminderSettings);
  const update = useProfileStore((s) => s.updateReminderSettings);

  const toggleDay = (day: number) => {
    const current = settings.reminderDaysBefore;
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => b - a);
    update({ reminderDaysBefore: next.length ? next : [0] });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Reminder Settings</Text>
        <Pressable onPress={() => router.push('/reminder-time')} accessibilityRole="button">
          <Text className="text-body font-bold text-primary">Time</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Pressable
          className="bg-primary/5 rounded-2xl p-4 flex-row items-center mt-4 mb-5 border border-primary/20"
          onPress={() => router.push('/reminder-time')}
          accessibilityRole="button">
          <Clock size={24} color="#7C3AED" />
          <View className="ml-3 flex-1">
            <Text className="text-[14px] font-bold text-foreground">Default Reminder Time</Text>
            <Text className="text-[13px] text-primary font-semibold mt-0.5">{settings.defaultTime}</Text>
          </View>
        </Pressable>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Remind Days Before</Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {DAY_OPTIONS.map((day) => (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              className={`px-4 py-2 rounded-xl border ${settings.reminderDaysBefore.includes(day) ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
              accessibilityRole="button">
              <Text className={`text-[13px] font-semibold ${settings.reminderDaysBefore.includes(day) ? 'text-primary' : 'text-foreground-secondary'}`}>
                {day === 0 ? 'Same day' : `${day}d before`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Weekend Rules</Text>
        <View className="gap-2 mb-5">
          {WEEKEND_RULES.map((rule) => (
            <Pressable
              key={rule.key}
              onPress={() => update({ weekendRules: rule.key })}
              className={`rounded-xl p-3 border ${settings.weekendRules === rule.key ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
              accessibilityRole="button">
              <Text className={`text-[14px] font-semibold ${settings.weekendRules === rule.key ? 'text-primary' : 'text-foreground'}`}>{rule.label}</Text>
            </Pressable>
          ))}
        </View>

        <View className="bg-surface rounded-2xl px-4 border border-border/60">
          <View className="flex-row items-center py-3.5">
            <Volume2 size={18} color="#7C3AED" style={{ marginRight: 12 }} />
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Notification Sound</Text>
            </View>
            <Switch value={settings.notificationSound} onValueChange={(v) => update({ notificationSound: v })} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#FFFFFF" />
          </View>
          <View className="h-[0.5px] bg-border/60" />
          <View className="flex-row items-center py-3.5">
            <Vibrate size={18} color="#7C3AED" style={{ marginRight: 12 }} />
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Vibration</Text>
            </View>
            <Switch value={settings.vibration} onValueChange={(v) => update({ vibration: v })} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#FFFFFF" />
          </View>
          <View className="h-[0.5px] bg-border/60" />
          <View className="flex-row items-center py-3.5">
            <Bell size={18} color="#F59E0B" style={{ marginRight: 12 }} />
            <View className="flex-1">
              <Text className="text-[15px] font-medium text-foreground">Birthday Alarm</Text>
              <Text className="text-[12px] text-foreground-secondary">Full-screen alarm on birthday</Text>
            </View>
            <Switch value={settings.birthdayAlarm} onValueChange={(v) => update({ birthdayAlarm: v })} trackColor={{ false: '#E5E7EB', true: '#7C3AED' }} thumbColor="#FFFFFF" />
          </View>
        </View>

        <Pressable
          className="mt-4 bg-surface rounded-xl p-3 border border-border/60"
          onPress={() => router.push('/quiet-hours')}
          accessibilityRole="button">
          <Text className="text-[14px] font-semibold text-primary text-center">Configure Quiet Hours →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
