export type CalendarGridCell = {
  key: string;
  date: number | null;
  isCurrentMonth: boolean;
};

export function buildMonthGrid(year: number, month: number): CalendarGridCell[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const cells: CalendarGridCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const date = daysInPrevMonth - i;
    cells.push({
      key: `prev-${date}`,
      date,
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      key: `curr-${day}`,
      date: day,
      isCurrentMonth: true,
    });
  }

  let nextMonthDay = 1;
  while (cells.length < 42) {
    cells.push({
      key: `next-${nextMonthDay}`,
      date: nextMonthDay,
      isCurrentMonth: false,
    });
    nextMonthDay += 1;
  }

  return cells;
}

export function chunkWeeks(cells: CalendarGridCell[]): CalendarGridCell[][] {
  const weeks: CalendarGridCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
