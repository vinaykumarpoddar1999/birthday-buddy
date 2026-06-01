import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Cake, ChevronDown, ChevronUp } from 'lucide-react-native';
import { router } from 'expo-router';

import { UpcomingBirthdayCard } from './UpcomingBirthdayCard';
import type { BirthdayEvent } from '../types';

type UpcomingBirthdayListProps = {
  items: BirthdayEvent[];
};

export function UpcomingBirthdayList({ items }: UpcomingBirthdayListProps) {
  const [expanded, setExpanded] = useState(false);
  const display = expanded ? items : items.slice(0, 3);

  if (items.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-1.5">
          <Cake size={18} color="#7C3AED" strokeWidth={2} />
          <Text className="text-title font-bold text-foreground">Upcoming</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/calendar')}
          className="flex-row items-center gap-1">
          <Text className="text-[12px] text-primary font-semibold">Calendar</Text>
        </Pressable>
      </View>

      {display.map((item) => (
        <UpcomingBirthdayCard key={item.id} item={item} />
      ))}

      {items.length > 3 && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setExpanded((v) => !v)}
          className="mt-1 items-center py-2">
          <View className="flex-row items-center gap-1">
            <Text className="text-[12px] text-primary font-semibold">
              {expanded ? 'Show Less' : `View All (${items.length})`}
            </Text>
            {expanded ? (
              <ChevronUp size={14} color="#7C3AED" />
            ) : (
              <ChevronDown size={14} color="#7C3AED" />
            )}
          </View>
        </Pressable>
      )}
    </View>
  );
}
