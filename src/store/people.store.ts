import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

export type RelationshipType = 'friend' | 'family' | 'colleague' | 'partner' | 'relative';
export type Gender = 'male' | 'female' | 'other';
export type PersonEventType = 'birthday' | 'anniversary' | 'wedding' | 'custom';

export interface StoredPerson {
  id: string;
  fullName: string;
  nickname?: string;
  gender: Gender;
  birthDate: string; // "YYYY-MM-DD"
  relationship: RelationshipType;
  phone?: string;
  email?: string;
  favoriteColor?: string;
  favoriteCake?: string;
  hobbies: string[];
  notes?: string;
  profileImage?: string;
  reminderDaysBefore: number;
  reminderTime: string; // "HH:mm"
  repeatYearly: boolean;
  eventType: PersonEventType;
  createdAt: string;
  updatedAt: string;
}

// Seed data — birthdays spread through the year with several in June (upcoming from May 31, 2026)
const SEED_PEOPLE: StoredPerson[] = [
  {
    id: 'seed-1',
    fullName: 'Aisha Khan',
    nickname: '',
    gender: 'female',
    birthDate: '2004-06-02',
    relationship: 'friend',
    phone: '+91 91723 45679',
    email: 'aisha.khan@email.com',
    hobbies: ['Dancing', 'Photography'],
    notes: 'Loves surprise parties!',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2',
    fullName: 'Arjun Verma',
    nickname: 'Arj',
    gender: 'male',
    birthDate: '1997-06-03',
    relationship: 'friend',
    phone: '+91 91661 28801',
    email: 'arjun.verma@email.com',
    hobbies: ['Cricket', 'Coding'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-3',
    fullName: 'Naina Roy',
    nickname: '',
    gender: 'female',
    birthDate: '2001-06-05',
    relationship: 'partner',
    phone: '+91 98710 55231',
    email: 'naina.roy@email.com',
    hobbies: ['Reading', 'Yoga'],
    notes: '',
    reminderDaysBefore: 5,
    reminderTime: '09:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-4',
    fullName: 'Kabir Shah',
    nickname: '',
    gender: 'male',
    birthDate: '1992-06-06',
    relationship: 'colleague',
    phone: '+91 97741 12003',
    email: 'kabir.shah@email.com',
    hobbies: ['Music', 'Movies'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-5',
    fullName: 'Meera Iyer',
    nickname: 'Mee',
    gender: 'female',
    birthDate: '2002-06-08',
    relationship: 'family',
    phone: '+91 98112 33445',
    email: 'meera.iyer@email.com',
    hobbies: ['Painting', 'Cooking'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-6',
    fullName: 'Dev Malhotra',
    nickname: 'Dev',
    gender: 'male',
    birthDate: '1993-06-09',
    relationship: 'friend',
    phone: '+91 99789 77890',
    email: 'dev.malhotra@email.com',
    hobbies: ['Gaming', 'Travel'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-7',
    fullName: 'Isha Nair',
    nickname: '',
    gender: 'female',
    birthDate: '1998-06-10',
    relationship: 'relative',
    phone: '+91 97663 21008',
    email: 'isha.nair@email.com',
    hobbies: ['Dancing', 'Travel'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-8',
    fullName: 'Farah Khan',
    nickname: '',
    gender: 'female',
    birthDate: '1997-06-19',
    relationship: 'partner',
    phone: '+91 96521 12340',
    email: 'farah.khan@email.com',
    hobbies: ['Movies', 'Food'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-9',
    fullName: 'Rohan Mehta',
    nickname: 'Ro',
    gender: 'male',
    birthDate: '1996-07-15',
    relationship: 'friend',
    phone: '+91 91344 88911',
    email: 'rohan.mehta@email.com',
    hobbies: ['Football', 'Cooking'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-10',
    fullName: 'Bhavna Gupta',
    nickname: '',
    gender: 'female',
    birthDate: '2000-07-03',
    relationship: 'friend',
    phone: '+91 93321 88700',
    email: 'bhavna.gupta@email.com',
    hobbies: ['Art', 'Dancing'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-11',
    fullName: 'Priya Patel',
    nickname: 'Priy',
    gender: 'female',
    birthDate: '1999-08-07',
    relationship: 'colleague',
    phone: '+91 99888 55110',
    email: 'priya.patel@email.com',
    hobbies: ['Music', 'Reading'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-12',
    fullName: 'Chirag Bansal',
    nickname: '',
    gender: 'male',
    birthDate: '1994-08-07',
    relationship: 'colleague',
    phone: '+91 91234 56780',
    email: 'chirag.bansal@email.com',
    hobbies: ['Photography', 'Travel'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-13',
    fullName: 'Vikram Singh',
    nickname: 'Vik',
    gender: 'male',
    birthDate: '1995-09-12',
    relationship: 'relative',
    phone: '+91 99881 12219',
    email: 'vikram.singh@email.com',
    hobbies: ['Cricket', 'Hiking'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-14',
    fullName: 'Sneha Kapoor',
    nickname: '',
    gender: 'female',
    birthDate: '2000-10-22',
    relationship: 'family',
    phone: '+91 98451 45673',
    email: 'sneha.kapoor@email.com',
    hobbies: ['Yoga', 'Cooking'],
    notes: '',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-15',
    fullName: 'Ananya Sharma',
    nickname: 'Anu',
    gender: 'female',
    birthDate: '1998-05-24',
    relationship: 'family',
    phone: '+91 98231 12220',
    email: 'ananya.sharma@email.com',
    hobbies: ['Reading', 'Music', 'Travel'],
    notes: 'Loves surprise parties! Allergic to nuts.',
    reminderDaysBefore: 3,
    reminderTime: '08:00',
    repeatYearly: true,
    eventType: 'birthday',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

type PeopleState = {
  people: StoredPerson[];
  addPerson: (data: Omit<StoredPerson, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePerson: (id: string, updates: Partial<Omit<StoredPerson, 'id' | 'createdAt'>>) => void;
  deletePerson: (id: string) => void;
  getPersonById: (id: string) => StoredPerson | undefined;
};

export const usePeopleStore = create<PeopleState>()(
  persist(
    (set, get) => ({
      people: SEED_PEOPLE,

      addPerson: (data) => {
        const id = `person-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const newPerson: StoredPerson = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ people: [...state.people, newPerson] }));
        return id;
      },

      updatePerson: (id, updates) => {
        set((state) => ({
          people: state.people.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p,
          ),
        }));
      },

      deletePerson: (id) => {
        set((state) => ({ people: state.people.filter((p) => p.id !== id) }));
      },

      getPersonById: (id) => get().people.find((p) => p.id === id),
    }),
    {
      name: 'birthday-buddy-people-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
