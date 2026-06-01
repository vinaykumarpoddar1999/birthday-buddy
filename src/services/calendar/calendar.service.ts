import {
  getBirthdayCalendarEvents,
  getCalendarUpcomingEvents,
} from '@features/people/utils/birthday-utils';
import { birthdayService } from '@/services/birthday/birthday.service';
import type { CalendarDayEvent, UpcomingEvent } from '@features/calendar/types';

export class CalendarService {
  async getMonthEvents(month: number): Promise<Record<number, CalendarDayEvent[]>> {
    const people = await birthdayService.getAllPeople();
    return getBirthdayCalendarEvents(people, month);
  }

  async getUpcomingForMonth(year: number, month: number): Promise<UpcomingEvent[]> {
    const people = await birthdayService.getAllPeople();
    return getCalendarUpcomingEvents(people, year, month);
  }
}

export const calendarService = new CalendarService();
