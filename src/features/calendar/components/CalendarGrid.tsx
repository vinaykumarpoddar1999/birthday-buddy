import { Text, View } from 'react-native';

import { WEEKDAY_LABELS } from '@features/calendar/constants/event-types';
import { buildMonthGrid, chunkWeeks } from '../utils/calendar-grid';
import type { CalendarDayEvent, EventType } from '../types';
import { CalendarCell } from './CalendarCell';

export type CalendarGridProps = {
  year: number;
  month: number;
  selectedDate: number;
  events: Record<number, CalendarDayEvent[]>;
  dotOnlyDates: Record<number, EventType[]>;
  onSelectDate: (date: number) => void;
  onSelectOverflowDate?: (direction: -1 | 1, date: number) => void;
};

export function CalendarGrid({
  year,
  month,
  selectedDate,
  events,
  dotOnlyDates,
  onSelectDate,
  onSelectOverflowDate,
}: CalendarGridProps) {
  const cells = buildMonthGrid(year, month);
  const weeks = chunkWeeks(cells);

  return (
    <View className="bg-surface rounded-xl border border-border p-3 shadow-card">
      <View className="flex-row mb-2">
        {WEEKDAY_LABELS.map((label, index) => (
          <View key={label} className="flex-1 items-center py-1">
            <Text
              className={`text-[11px] font-semibold ${
                index === 0
                  ? 'text-error'
                  : index === 6
                    ? 'text-primary'
                    : 'text-foreground-secondary'
              }`}>
              {label}
            </Text>
          </View>
        ))}
      </View>
      {weeks.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} className="flex-row">
          {week.map((cell) => (
            <CalendarCell
              key={cell.key}
              date={cell.date}
              isCurrentMonth={cell.isCurrentMonth}
              isSelected={cell.isCurrentMonth && cell.date === selectedDate}
              events={cell.isCurrentMonth && cell.date ? events[cell.date] ?? [] : []}
              dotTypes={
                cell.isCurrentMonth && cell.date ? dotOnlyDates[cell.date] ?? [] : []
              }
              onPress={() => {
                if (!cell.date) return;
                if (cell.isCurrentMonth) {
                  onSelectDate(cell.date);
                  return;
                }
                if (cell.key.startsWith('prev-')) {
                  onSelectOverflowDate?.(-1, cell.date);
                } else if (cell.key.startsWith('next-')) {
                  onSelectOverflowDate?.(1, cell.date);
                }
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
