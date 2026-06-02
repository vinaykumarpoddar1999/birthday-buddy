import { router } from 'expo-router';
import { CalendarDays, Plus } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarSkeleton, EmptyState, ErrorState } from '@shared/ui';
import { feedback } from '@/shared/feedback';
import { usePeople } from '@features/people/hooks/usePeople';
import { getPeopleForCalendarDay } from '@features/people/utils/birthday-utils';
import { useCalendarMonth } from '@features/calendar/hooks/useCalendar';
import {
  AddEventButton,
  CalendarGrid,
  CalendarHeader,
  CalendarSwitcher,
  CalendarToolbar,
  CalendarTimelineView,
  EventLegend,
  UpcomingSection,
} from '../components';
import type { CalendarViewMode } from '../types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function CalendarScreen() {
  const today = new Date();
  const [activeView, setActiveView] = useState<CalendarViewMode>('month');
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const { data: allPeople = [], isLoading: peopleLoading, isFetching: peopleFetching } = usePeople();
  const {
    events: calendarEvents,
    upcoming: upcomingEvents,
    isLoading: calendarLoading,
    isError,
    refetch,
  } = useCalendarMonth(year, month);

  const isLoading = peopleLoading || calendarLoading;

  const monthLabel = useMemo(() => `${MONTH_NAMES[month - 1]} ${year}`, [month, year]);
  const shortMonthLabel = useMemo(() => MONTH_NAMES[month - 1], [month]);

  const clampSelectedDate = useCallback(
    (y: number, m: number, date: number) => Math.min(date, getDaysInMonth(y, m)),
    [],
  );

  useEffect(() => {
    setSelectedDate((prev) => clampSelectedDate(year, month, prev));
  }, [year, month, clampSelectedDate]);

  const handlePreviousMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
      return;
    }
    setMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
      return;
    }
    setMonth((m) => m + 1);
  };

  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    setSelectedDate(now.getDate());
  };

  const handleSelectDate = (date: number) => {
    const clamped = clampSelectedDate(year, month, date);
    setSelectedDate(clamped);
    const dayPeople = getPeopleForCalendarDay(allPeople, month, clamped);
    if (dayPeople.length === 1) {
      router.push({ pathname: '/person-details', params: { personId: dayPeople[0].id } });
      return;
    }
    if (dayPeople.length > 1) {
      feedback.actionSheet({
        title: `${dayPeople.length} birthdays on this day`,
        options: dayPeople.map((person) => ({
          label: person.fullName,
          onPress: () =>
            router.push({ pathname: '/person-details', params: { personId: person.id } }),
        })),
      });
    }
  };

  const handleSelectOverflowDate = (direction: -1 | 1, date: number) => {
    if (direction < 0) {
      if (month === 1) {
        setYear((y) => y - 1);
        setMonth(12);
      } else {
        setMonth((m) => m - 1);
      }
    } else if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(date);
    const nextMonth = direction < 0 ? (month === 1 ? 12 : month - 1) : month === 12 ? 1 : month + 1;
    const nextYear =
      direction < 0
        ? month === 1
          ? year - 1
          : year
        : month === 12
          ? year + 1
          : year;
    const dayPeople = getPeopleForCalendarDay(allPeople, nextMonth, date);
    if (dayPeople.length === 1) {
      router.push({ pathname: '/person-details', params: { personId: dayPeople[0].id } });
    } else if (dayPeople.length > 1) {
      feedback.actionSheet({
        title: `${dayPeople.length} birthdays on this day`,
        options: dayPeople.map((person) => ({
          label: person.fullName,
          onPress: () =>
            router.push({ pathname: '/person-details', params: { personId: person.id } }),
        })),
      });
    }
  };

  const hasMonthEvents = upcomingEvents.length > 0 || Object.keys(calendarEvents).length > 0;
  const hasAnyPeople = allPeople.length > 0;
  const showGlobalEmpty = !peopleLoading && !peopleFetching && !hasAnyPeople;

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
          contentContainerClassName="px-5 pt-2 pb-28"
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
            onToday={handleToday}
          />

          {activeView === 'month' ? (
            <>
              <CalendarGrid
                year={year}
                month={month}
                selectedDate={selectedDate}
                events={calendarEvents}
                dotOnlyDates={{}}
                onSelectDate={handleSelectDate}
                onSelectOverflowDate={handleSelectOverflowDate}
              />
              <EventLegend />
            </>
          ) : upcomingEvents.length > 0 ? (
            <CalendarTimelineView events={upcomingEvents} />
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No timeline events"
              subtitle="Upcoming birthdays will show here once you add people."
              primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
              className="py-8"
            />
          )}

          {showGlobalEmpty ? (
            <EmptyState
              icon={Plus}
              title="Your calendar is empty"
              subtitle="Add people with birthdays to see them marked on every month."
              primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
              className="mt-4 bg-primary/5 border border-primary/15 rounded-2xl"
            />
          ) : hasMonthEvents ? (
            <UpcomingSection monthLabel={shortMonthLabel} events={upcomingEvents} />
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
