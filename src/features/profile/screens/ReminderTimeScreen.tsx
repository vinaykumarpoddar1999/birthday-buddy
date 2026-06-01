import { router } from 'expo-router';
import { ArrowLeft, Check, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';

const TIMES = [
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

export const ReminderTimeScreen = () => {
  const currentTime = useProfileStore((s) => s.reminderSettings.defaultTime);
  const update = useProfileStore((s) => s.updateReminderSettings);
  const [selected, setSelected] = useState(currentTime);

  const handleSave = () => {
    update({ defaultTime: selected });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Reminder Time</Text>
        <Pressable onPress={handleSave} accessibilityRole="button">
          <Text className="text-body font-bold text-primary">Save</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 rounded-2xl p-4 items-center mt-4 mb-5">
          <Clock size={32} color="#7C3AED" />
          <Text className="text-heading text-foreground font-bold mt-2">
            {TIMES.find((t) => t.value === selected)?.label ?? selected}
          </Text>
          <Text className="text-caption text-foreground-secondary mt-1">Set default reminder time for all events</Text>
        </View>

        <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">Select Time</Text>
        <View className="flex-row flex-wrap gap-3">
          {TIMES.map((time) => {
            const isSelected = time.value === selected;
            return (
              <Pressable
                key={time.value}
                onPress={() => setSelected(time.value)}
                className={`w-[31%] rounded-xl py-3 px-2 border items-center ${isSelected ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                accessibilityRole="button">
                {isSelected && <Check size={14} color="#7C3AED" style={{ position: 'absolute', top: 6, right: 6 }} />}
                <Text className={`text-[14px] font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{time.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
