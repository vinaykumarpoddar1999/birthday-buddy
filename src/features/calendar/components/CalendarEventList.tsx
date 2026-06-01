import { Text, View } from 'react-native';

import type { UpcomingEvent } from '../types';
import { UpcomingEventCard } from './UpcomingEventCard';

export type CalendarEventListProps = {
  events: UpcomingEvent[];
  emptyMessage?: string;
};

export function CalendarEventList({
  events,
  emptyMessage = 'No events this month. Add people to see birthdays here.',
}: CalendarEventListProps) {
  if (events.length === 0) {
    return (
      <View className="bg-surface rounded-xl border border-border p-6 mb-5 items-center min-h-[200px] justify-center">
        <Text className="text-caption text-foreground-secondary text-center">{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View className="mb-5">
      {events.map((event) => (
        <UpcomingEventCard key={event.id} event={event} />
      ))}
    </View>
  );
}

export function CalendarTimelineView({ events }: CalendarEventListProps) {
  if (events.length === 0) {
    return (
      <View className="bg-surface rounded-xl border border-border p-6 mb-5 items-center min-h-[200px] justify-center">
        <Text className="text-caption text-foreground-secondary text-center">
          No upcoming events in this month.
        </Text>
      </View>
    );
  }

  const grouped = events.reduce<Record<string, UpcomingEvent[]>>((acc, event) => {
    const key = `${event.month} ${event.day}`;
    acc[key] = acc[key] ?? [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <View className="mb-5">
      {Object.entries(grouped).map(([dateKey, dayEvents]) => (
        <View key={dateKey} className="mb-4">
          <View className="flex-row items-center mb-2">
            <View className="h-2 w-2 rounded-full bg-primary mr-2" />
            <Text className="text-body font-bold text-foreground">{dateKey}</Text>
          </View>
          <View className="ml-3 border-l-2 border-primary/20 pl-3">
            {dayEvents.map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
