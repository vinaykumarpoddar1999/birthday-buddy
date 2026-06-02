import { Pressable, StyleSheet, Text, View } from 'react-native';

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

const styles = StyleSheet.create({
  emptyCell: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
  },
  pressable: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
    minHeight: 44,
  },
  inner: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
    paddingHorizontal: 2,
  },
  innerSelected: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  innerOtherMonth: {
    backgroundColor: 'transparent',
    opacity: 0.4,
  },
  innerDefault: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  dayTextCurrent: {
    color: '#111827',
  },
  dayTextMuted: {
    color: '#9CA3AF',
  },
  markers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    minHeight: 22,
  },
  markerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 2,
  },
});

export function CalendarCell({
  date,
  isCurrentMonth,
  isSelected,
  events,
  dotTypes = [],
  onPress,
}: CalendarCellProps) {
  if (date == null) {
    return <View style={styles.emptyCell} />;
  }

  const visibleEvents = events.slice(0, 2);
  const showDots = visibleEvents.length === 0 && dotTypes.length > 0;

  const innerStyle = [
    styles.inner,
    isSelected
      ? styles.innerSelected
      : isCurrentMonth
        ? styles.innerDefault
        : styles.innerOtherMonth,
  ];

  const dayTextStyle = [
    styles.dayText,
    isSelected
      ? styles.dayTextSelected
      : isCurrentMonth
        ? styles.dayTextCurrent
        : styles.dayTextMuted,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${date}${isSelected ? ', selected' : ''}`}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={styles.pressable}>
      <View style={innerStyle}>
        <Text style={dayTextStyle}>{date}</Text>
        <View style={styles.markers}>
          {isSelected && visibleEvents[0] ? (
            <EventMarker
              type={visibleEvents[0].type}
              avatarVariant={visibleEvents[0].avatarVariant}
              avatarUri={visibleEvents[0].avatarUri}
              gender={visibleEvents[0].gender}
              compact
            />
          ) : null}
          {!isSelected && visibleEvents.length > 0 ? (
            <View style={styles.markerRow}>
              {visibleEvents.map((event) => (
                <EventMarker
                  key={event.id}
                  type={event.type}
                  avatarVariant={event.avatarVariant}
                  avatarUri={event.avatarUri}
                  gender={event.gender}
                  compact
                />
              ))}
            </View>
          ) : null}
          {showDots ? (
            <View style={styles.dotRow}>
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
