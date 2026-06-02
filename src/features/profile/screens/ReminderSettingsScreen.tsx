import { router } from 'expo-router';
import { ArrowLeft, Bell, Check, Clock, Plus, Volume2, Vibrate, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';
import type { ReminderSettings } from '../types';

const DAY_OPTIONS = [0, 1, 3, 7, 14];
const WEEKEND_RULES: { key: ReminderSettings['weekendRules']; label: string }[] = [
  { key: 'same', label: 'Same as weekdays' },
  { key: 'skip', label: 'Skip weekends' },
  { key: 'earlier', label: 'Remind Friday instead' },
];

const TIME_PRESETS = [
  { label: '6:00 AM', value: '06:00' },
  { label: '7:00 AM', value: '07:00' },
  { label: '8:00 AM', value: '08:00' },
  { label: '9:00 AM', value: '09:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '6:00 PM', value: '18:00' },
  { label: '8:00 PM', value: '20:00' },
];

function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export const ReminderSettingsScreen = () => {
  const settings = useProfileStore((s) => s.reminderSettings);
  const update = useProfileStore((s) => s.updateReminderSettings);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerTime, setPickerTime] = useState('08:00');

  const toggleDay = (day: number) => {
    const current = settings.reminderDaysBefore;
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => b - a);
    update({ reminderDaysBefore: next.length ? next : [0] });
  };

  const setTimingMode = (mode: 'fixed' | 'flexible') => {
    if (mode === 'flexible' && settings.multipleReminderTimes.length === 0) {
      update({
        timingMode: mode,
        multipleReminderTimes: [settings.defaultTime],
      });
      return;
    }
    update({ timingMode: mode });
  };

  const addFlexibleTime = (time: string) => {
    const current = settings.multipleReminderTimes;
    if (current.includes(time) || current.length >= 3) return;
    update({ multipleReminderTimes: [...current, time].sort() });
    setShowTimePicker(false);
  };

  const removeFlexibleTime = (time: string) => {
    const next = settings.multipleReminderTimes.filter((t) => t !== time);
    update({
      multipleReminderTimes: next.length ? next : [settings.defaultTime],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Reminder Settings</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2 mt-4">Timing Mode</Text>
        <View className="flex-row gap-2 mb-5">
          <Pressable
            onPress={() => setTimingMode('fixed')}
            className={`flex-1 rounded-xl p-3 border ${settings.timingMode === 'fixed' ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
            accessibilityRole="button">
            <Text className={`text-[14px] font-semibold ${settings.timingMode === 'fixed' ? 'text-primary' : 'text-foreground'}`}>Fixed</Text>
            <Text className="text-[11px] text-foreground-secondary mt-0.5">One default time for all</Text>
          </Pressable>
          <Pressable
            onPress={() => setTimingMode('flexible')}
            className={`flex-1 rounded-xl p-3 border ${settings.timingMode === 'flexible' ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
            accessibilityRole="button">
            <Text className={`text-[14px] font-semibold ${settings.timingMode === 'flexible' ? 'text-primary' : 'text-foreground'}`}>Flexible</Text>
            <Text className="text-[11px] text-foreground-secondary mt-0.5">Multiple reminder times</Text>
          </Pressable>
        </View>

        {settings.timingMode === 'fixed' ? (
          <Pressable
            className="bg-primary/5 rounded-2xl p-4 flex-row items-center mb-5 border border-primary/20"
            onPress={() => router.push('/reminder-time')}
            accessibilityRole="button">
            <Clock size={24} color="#7C3AED" />
            <View className="ml-3 flex-1">
              <Text className="text-[14px] font-bold text-foreground">Default Reminder Time</Text>
              <Text className="text-[13px] text-primary font-semibold mt-0.5">{formatTime12(settings.defaultTime)}</Text>
            </View>
          </Pressable>
        ) : (
          <View className="mb-5">
            <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Reminder Times (up to 3)</Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {settings.multipleReminderTimes.map((time) => (
                <View key={time} className="flex-row items-center bg-primary/10 border border-primary rounded-xl px-3 py-2">
                  <Text className="text-[13px] font-semibold text-primary mr-2">{formatTime12(time)}</Text>
                  <Pressable onPress={() => removeFlexibleTime(time)} accessibilityRole="button" accessibilityLabel={`Remove ${time}`}>
                    <X size={14} color="#7C3AED" />
                  </Pressable>
                </View>
              ))}
              {settings.multipleReminderTimes.length < 3 && (
                <Pressable
                  onPress={() => {
                    setPickerTime('08:00');
                    setShowTimePicker(true);
                  }}
                  className="flex-row items-center bg-surface border border-dashed border-primary/40 rounded-xl px-3 py-2"
                  accessibilityRole="button">
                  <Plus size={14} color="#7C3AED" />
                  <Text className="text-[13px] font-semibold text-primary ml-1">Add Time</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

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

      <Modal visible={showTimePicker} transparent animationType="slide" onRequestClose={() => setShowTimePicker(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <Text className="text-title font-bold text-foreground mb-4">Add Reminder Time</Text>
            <View className="flex-row flex-wrap gap-2 mb-5">
              {TIME_PRESETS.map((time) => {
                const isSelected = pickerTime === time.value;
                const isUsed = settings.multipleReminderTimes.includes(time.value);
                return (
                  <Pressable
                    key={time.value}
                    onPress={() => !isUsed && setPickerTime(time.value)}
                    disabled={isUsed}
                    className={`w-[31%] rounded-xl py-3 px-2 border items-center ${isSelected ? 'bg-primary/10 border-primary' : isUsed ? 'bg-border/20 border-border opacity-50' : 'bg-surface border-border'}`}
                    accessibilityRole="button">
                    {isSelected && <Check size={14} color="#7C3AED" style={{ position: 'absolute', top: 6, right: 6 }} />}
                    <Text className={`text-[13px] font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{time.label}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              className="bg-primary rounded-2xl py-4 items-center mb-2"
              onPress={() => addFlexibleTime(pickerTime)}
              accessibilityRole="button">
              <Text className="text-white font-bold text-[15px]">Add Time</Text>
            </Pressable>
            <Pressable onPress={() => setShowTimePicker(false)} className="py-3 items-center" accessibilityRole="button">
              <Text className="text-foreground-secondary font-semibold">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
