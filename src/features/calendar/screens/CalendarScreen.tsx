import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePeopleStore } from '@store/people.store';
import {
  getBirthdayCalendarEvents,
  getCalendarUpcomingEvents,
} from '@features/people/utils/birthday-utils';
import {
  AddEventButton,
  CalendarGrid,
  CalendarHeader,
  CalendarSwitcher,
  CalendarToolbar,
  EventLegend,
  FloatingActionButton,
  UpcomingSection,
} from '../components';
import type { CalendarViewMode } from '../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarScreen() {
  const people = usePeopleStore((s) => s.people);

  const today = new Date();
  const [activeView, setActiveView] = useState<CalendarViewMode>('month');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const monthLabel = useMemo(() => `${MONTH_NAMES[month - 1]} ${year}`, [month, year]);
  const shortMonthLabel = useMemo(() => MONTH_NAMES[month - 1], [month]);

  const handlePreviousMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); return; }
    setMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); return; }
    setMonth((m) => m + 1);
  };

  // Compute calendar events from store for the current month
  const calendarEvents = useMemo(
    () => getBirthdayCalendarEvents(people, month),
    [people, month],
  );

  // Upcoming events section
  const upcomingEvents = useMemo(
    () => getCalendarUpcomingEvents(people, year, month),
    [people, year, month],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-2 pb-36"
          showsVerticalScrollIndicator={false}>
          <CalendarHeader />

          <View className="flex-row items-center mb-4">
            <CalendarSwitcher activeView={activeView} onViewChange={setActiveView} />
            <AddEventButton onPress={() => router.push('/add-person')} />
          </View>

          <CalendarToolbar
            monthLabel={monthLabel}
            onPrevious={handlePreviousMonth}
            onNext={handleNextMonth}
          />

          {activeView === 'month' ? (
            <>
              <CalendarGrid
                year={year}
                month={month}
                selectedDate={selectedDate}
                events={calendarEvents}
                dotOnlyDates={{}}
                onSelectDate={setSelectedDate}
              />
              <EventLegend />
            </>
          ) : (
            <View className="bg-surface rounded-xl border border-border p-6 mb-5 items-center shadow-card min-h-[200px] justify-center">
              <Text className="text-title text-foreground font-semibold capitalize">
                {activeView} view
              </Text>
              <Text className="text-caption text-foreground-secondary mt-2 text-center">
                UI placeholder — switch to Month for the full calendar grid.
              </Text>
            </View>
          )}

          <UpcomingSection monthLabel={shortMonthLabel} events={upcomingEvents} />
        </ScrollView>

        <FloatingActionButton onPress={() => router.push('/add-person')} />
      </View>
    </SafeAreaView>
  );
}
