import { useQuery } from '@tanstack/react-query';

import { calendarService } from '@/services/calendar/calendar.service';

export const calendarQueryKeys = {
  month: (year: number, month: number) => ['calendar', year, month] as const,
};

export function useCalendarMonth(year: number, month: number) {
  const events = useQuery({
    queryKey: [...calendarQueryKeys.month(year, month), 'events'],
    queryFn: () => calendarService.getMonthEvents(month),
    staleTime: 0,
  });

  const upcoming = useQuery({
    queryKey: [...calendarQueryKeys.month(year, month), 'upcoming'],
    queryFn: () => calendarService.getUpcomingForMonth(year, month),
    staleTime: 0,
  });

  return {
    events: events.data ?? {},
    upcoming: upcoming.data ?? [],
    isLoading: events.isLoading || upcoming.isLoading,
    isError: events.isError || upcoming.isError,
    refetch: () => {
      void events.refetch();
      void upcoming.refetch();
    },
  };
}
