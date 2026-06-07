import { peopleService } from '@/services/people/people.service';
import { wishRepository } from '@/repositories/wish.repository';
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
import type { Person } from '@/types/entities';
import type { BirthdayEvent, Contact } from '@features/people/types';

export type HomeInsights = {
  remindersToday: number;
  streakDays: number;
  upcomingThisWeek: number;
};

async function computeBirthdaysWished(): Promise<number> {
  const history = await wishRepository.findHistory(undefined, 5000);
  return history.filter((entry) => entry.action === 'shared').length;
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
    const [people, birthdaysWished] = await Promise.all([
      this.getAllPeople(),
      computeBirthdaysWished(),
    ]);

    const remindersToday = people.filter((person) => {
      const days = getDaysUntilBirthday(person.birthDate);
      return days === 0 || days === 1;
    }).length;

    const upcomingThisWeek = people.filter((person) => getDaysUntilBirthday(person.birthDate) <= 7).length;

    return {
      remindersToday,
      streakDays: birthdaysWished,
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
