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
  birthdaysThisMonth: number;
  streakDays: number;
  upcomingThisWeek: number;
};

async function computeBirthdaysWished(): Promise<number> {
  const history = await wishRepository.findHistory(undefined, 5000);
  return history.filter((entry) => entry.action === 'shared').length;
}

function isBirthdayInCurrentMonth(birthDate: string): boolean {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const parts = birthDate.trim().split('-');
  const month =
    parts.length >= 3 ? parseInt(parts[parts.length - 2]!, 10) : parseInt(parts[0]!, 10);
  return month === currentMonth;
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

    const birthdaysThisMonth = people.filter((person) => isBirthdayInCurrentMonth(person.birthDate)).length;

    const upcomingThisWeek = people.filter((person) => getDaysUntilBirthday(person.birthDate) <= 7).length;

    return {
      birthdaysThisMonth,
      streakDays: birthdaysWished,
      upcomingThisWeek,
    };
  }

  async getBirthdaysWishedCount(): Promise<number> {
    return computeBirthdaysWished();
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
