import { router } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarSkeleton, EmptyState, ErrorState } from '@shared/ui';
import { useCalendarMonth } from '@features/calendar/hooks/useCalendar';
import {
  AddEventButton,
  CalendarGrid,
  CalendarHeader,
  CalendarSwitcher,
  CalendarToolbar,
  CalendarEventList,
  CalendarTimelineView,
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
  const today = new Date();
  const [activeView, setActiveView] = useState<CalendarViewMode>('month');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const {
    events: calendarEvents,
    upcoming: upcomingEvents,
    isLoading,
    isError,
    refetch,
  } = useCalendarMonth(year, month);

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

  const hasEvents = Object.keys(calendarEvents).length > 0 || upcomingEvents.length > 0;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <CalendarSkeleton />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <ErrorState kind="database" onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

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
          ) : activeView === 'list' ? (
            upcomingEvents.length > 0 ? (
              <CalendarEventList events={upcomingEvents} />
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No events this month"
                subtitle="Birthdays you add will appear on the calendar automatically."
                primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
                className="py-8 bg-surface border border-border rounded-2xl"
              />
            )
          ) : (
            upcomingEvents.length > 0 ? (
              <CalendarTimelineView events={upcomingEvents} />
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No timeline events"
                subtitle="Upcoming birthdays will show here once you add people."
                primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
                className="py-8"
              />
            )
          )}

          {!hasEvents ? (
            <EmptyState
              icon={CalendarDays}
              title="Your calendar is empty"
              subtitle="Add people with birthdays to see them marked on every month."
              primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
              className="mt-4 bg-primary/5 border border-primary/15 rounded-2xl"
            />
          ) : (
            <UpcomingSection monthLabel={shortMonthLabel} events={upcomingEvents} />
          )}
        </ScrollView>

        <FloatingActionButton onPress={() => router.push('/add-person')} />
      </View>
    </SafeAreaView>
  );
}
