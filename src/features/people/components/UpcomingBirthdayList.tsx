import { Pressable, Text, View } from 'react-native';
import { CalendarDays, ChevronDown } from 'lucide-react-native';

import { UpcomingBirthdayCard } from './UpcomingBirthdayCard';
import type { BirthdayEvent } from '../types';

type UpcomingBirthdayListProps = {
  items: BirthdayEvent[];
  totalCount?: number;
};

export function UpcomingBirthdayList({ items, totalCount }: UpcomingBirthdayListProps) {
  const displayCount = totalCount ?? items.length;
  return (
    <View className="mb-3">
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-title text-foreground font-bold">Upcoming Birthdays 🎂</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View calendar"
          onPress={() => {}}
          className="flex-row items-center">
          <CalendarDays size={14} color="#7C3AED" />
          <Text className="text-caption text-primary font-semibold ml-1">View Calendar</Text>
        </Pressable>
      </View>

      {items.slice(0, 5).map((item) => (
        <UpcomingBirthdayCard key={item.id} item={item} />
      ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View all upcoming birthdays"
        onPress={() => {}}
        className="mt-1 items-center">
        <View className="flex-row items-center">
          <Text className="text-caption text-primary font-semibold">View All Upcoming ({displayCount})</Text>
          <ChevronDown size={14} color="#7C3AED" />
        </View>
      </Pressable>
    </View>
  );
}
