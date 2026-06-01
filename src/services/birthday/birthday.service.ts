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
