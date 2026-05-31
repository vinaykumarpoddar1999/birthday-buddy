import { Pressable, Text, View } from 'react-native';

import type { CalendarDayEvent, EventType } from '../types';
import { EventDot, EventMarker } from './EventMarker';

export type CalendarCellProps = {
  date: number | null;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday?: boolean;
  events: CalendarDayEvent[];
  dotTypes?: EventType[];
  onPress: () => void;
};

export function CalendarCell({
  date,
  isCurrentMonth,
  isSelected,
  events,
  dotTypes = [],
  onPress,
}: CalendarCellProps) {
  if (date == null) {
    return <View className="flex-1 aspect-square p-0.5" />;
  }

  const visibleEvents = events.slice(0, 2);
  const showDots = visibleEvents.length === 0 && dotTypes.length > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${date}${isSelected ? ', selected' : ''}`}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      className="flex-1 aspect-square p-0.5 min-h-[44px]">
      <View
        className={`flex-1 rounded-lg items-center pt-1 pb-0.5 px-0.5 ${
          isSelected
            ? 'bg-primary shadow-md'
            : isCurrentMonth
              ? 'bg-transparent'
              : 'bg-transparent opacity-40'
        }`}>
        <Text
          className={`text-[12px] font-semibold ${
            isSelected
              ? 'text-white'
              : isCurrentMonth
                ? 'text-foreground'
                : 'text-foreground-muted'
          }`}>
          {date}
        </Text>
        <View className="flex-1 items-center justify-end pb-0.5 min-h-[22px]">
          {isSelected && visibleEvents[0] ? (
            <EventMarker
              type={visibleEvents[0].type}
              avatarVariant={visibleEvents[0].avatarVariant}
              compact
            />
          ) : null}
          {!isSelected && visibleEvents.length > 0 ? (
            <View className="flex-row items-end justify-center gap-0.5">
              {visibleEvents.map((event) => (
                <EventMarker
                  key={event.id}
                  type={event.type}
                  avatarVariant={event.avatarVariant}
                  compact
                />
              ))}
            </View>
          ) : null}
          {showDots ? (
            <View className="flex-row gap-0.5">
              {dotTypes.map((type, index) => (
                <EventDot key={`${date}-dot-${index}`} type={type} />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
