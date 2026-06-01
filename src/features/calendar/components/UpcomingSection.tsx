import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import type { UpcomingEvent } from '../types';
import { UpcomingEventCard } from './UpcomingEventCard';

export type UpcomingSectionProps = {
  monthLabel: string;
  events: UpcomingEvent[];
};

export function UpcomingSection({ monthLabel, events }: UpcomingSectionProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-title text-foreground font-bold">Upcoming ({monthLabel})</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all upcoming events"
          onPress={() => router.push('/(tabs)/calendar')}
          className="flex-row items-center min-h-[44px]">
          <Text className="text-caption text-primary font-semibold">View All</Text>
          <ChevronRight size={14} color="#7C3AED" />
        </Pressable>
      </View>
      {events.map((event) => (
        <UpcomingEventCard key={event.id} event={event} />
      ))}
    </View>
  );
}
