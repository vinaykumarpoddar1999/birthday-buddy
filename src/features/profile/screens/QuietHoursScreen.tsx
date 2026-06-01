import { router } from 'expo-router';
import { ArrowLeft, Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';

const START_TIMES = [
  { label: '8:00 PM', value: '20:00' },
  { label: '9:00 PM', value: '21:00' },
  { label: '10:00 PM', value: '22:00' },
  { label: '11:00 PM', value: '23:00' },
];

const END_TIMES = [
  { label: '5:00 AM', value: '05:00' },
  { label: '6:00 AM', value: '06:00' },
  { label: '7:00 AM', value: '07:00' },
  { label: '8:00 AM', value: '08:00' },
];

export const QuietHoursScreen = () => {
  const settings = useProfileStore((s) => s.reminderSettings);
  const update = useProfileStore((s) => s.updateReminderSettings);
  const [start, setStart] = useState(settings.quietHoursStart);
  const [end, setEnd] = useState(settings.quietHoursEnd);

  const handleSave = () => {
    update({ quietHoursStart: start, quietHoursEnd: end });
    router.back();
  };

  const getLabel = (value: string, list: { label: string; value: string }[]) =>
    list.find((t) => t.value === value)?.label ?? value;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Quiet Hours</Text>
        <Pressable onPress={handleSave} accessibilityRole="button">
          <Text className="text-body font-bold text-primary">Save</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Visual Timeline */}
        <View className="bg-primary/5 rounded-2xl p-4 items-center mt-4 mb-5">
          <View className="flex-row items-center gap-3">
            <Moon size={24} color="#7C3AED" />
            <Text className="text-heading text-foreground font-bold">
              {getLabel(start, START_TIMES)} – {getLabel(end, END_TIMES)}
            </Text>
            <Sun size={24} color="#F59E0B" />
          </View>
          <Text className="text-caption text-foreground-secondary mt-2 text-center">
            Notifications will be paused during quiet hours
          </Text>
          <View className="w-full h-3 bg-border/40 rounded-full mt-3 overflow-hidden">
            <View className="h-full bg-primary/30 rounded-full" style={{ width: '60%', marginLeft: '20%' }} />
          </View>
          <View className="flex-row justify-between w-full mt-1">
            <Text className="text-[10px] text-foreground-secondary">12 PM</Text>
            <Text className="text-[10px] text-primary font-bold">Quiet</Text>
            <Text className="text-[10px] text-foreground-secondary">12 PM</Text>
          </View>
        </View>

        {/* Start Time */}
        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Start Time</Text>
        <View className="flex-row gap-3 mb-5">
          {START_TIMES.map((t) => {
            const isSelected = t.value === start;
            return (
              <Pressable
                key={t.value}
                onPress={() => setStart(t.value)}
                className={`flex-1 rounded-xl py-3 items-center border ${isSelected ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                accessibilityRole="button">
                <Text className={`text-[13px] font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* End Time */}
        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">End Time</Text>
        <View className="flex-row gap-3">
          {END_TIMES.map((t) => {
            const isSelected = t.value === end;
            return (
              <Pressable
                key={t.value}
                onPress={() => setEnd(t.value)}
                className={`flex-1 rounded-xl py-3 items-center border ${isSelected ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                accessibilityRole="button">
                <Text className={`text-[13px] font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
