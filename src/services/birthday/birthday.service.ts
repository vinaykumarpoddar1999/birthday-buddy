import {
  getBirthdayStats,
  getDaysUntilBirthday,
  getUpcomingPeople,
  sortByUpcoming,
  toBirthdayEvent,
  toContact,
  toHomeUpcomingCard,
  type BirthdayStats,
  type HomeUpcomingCardData,
} from '@features/people/utils/birthday-utils';
import { peopleService } from '@/services/people/people.service';
import type { Person } from '@/types/entities';
import type { BirthdayEvent, Contact } from '@features/people/types';
import { activityLogRepository } from '@/repositories/activity-log.repository';

export type HomeInsights = {
  remindersToday: number;
  streakDays: number;
  upcomingThisWeek: number;
};

function toLocalDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function computeUsageStreak(logDates: string[]): number {
  if (logDates.length === 0) return 0;

  const activeDaySet = new Set(
    logDates
      .map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.getTime()))
      .map((date) => toLocalDayKey(date)),
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (activeDaySet.has(toLocalDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export class BirthdayService {
  async getAllPeople(): Promise<Person[]> {
    return peopleService.list(500, 0);
  }

  async getUpcoming(limit?: number): Promise<Person[]> {
    const people = await this.getAllPeople();
    return getUpcomingPeople(people, limit);
  }

  async getSorted(): Promise<Person[]> {
    const people = await this.getAllPeople();
    return sortByUpcoming(people);
  }

  async getStats(): Promise<BirthdayStats> {
    const people = await this.getAllPeople();
    return getBirthdayStats(people);
  }

  async getHomeInsights(): Promise<HomeInsights> {
    const [people, logs] = await Promise.all([
      this.getAllPeople(),
      activityLogRepository.findRecent(365),
    ]);

    const remindersToday = people.filter((person) => {
      const days = getDaysUntilBirthday(person.birthDate);
      return days === 0 || days === 1;
    }).length;

    const upcomingThisWeek = people.filter((person) => getDaysUntilBirthday(person.birthDate) <= 7).length;

    return {
      remindersToday,
      streakDays: computeUsageStreak(logs.map((log) => log.createdAt)),
      upcomingThisWeek,
    };
  }

  async getHomeCards(limit = 10): Promise<HomeUpcomingCardData[]> {
    const upcoming = await this.getUpcoming(limit);
    return upcoming.map((p, i) => toHomeUpcomingCard(p, i));
  }

  async getBirthdayEvents(): Promise<BirthdayEvent[]> {
    const sorted = await this.getSorted();
    return sorted.map((p) => toBirthdayEvent(p));
  }

  async getContacts(): Promise<Contact[]> {
    const people = await this.getAllPeople();
    return people.map((p) => toContact(p));
  }

  getDaysUntil(birthDate: string): number {
    return getDaysUntilBirthday(birthDate);
  }
}

export const birthdayService = new BirthdayService();
