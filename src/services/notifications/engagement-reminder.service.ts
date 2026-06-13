import { Platform } from 'react-native';

import { peopleRepository } from '@/repositories/people.repository';
import type { Person } from '@/types/entities';
import {
  getDaysUntilBirthday,
  parseBirthDateParts,
} from '@features/people/utils/birthday-utils';

import { getNotificationsModule } from './notifications-api';
import { registerForNotifications } from './notification-init.utils';

export const ENGAGEMENT_REMINDER_ID = 'engagement-add-friends-weekly';

const ENGAGEMENT_NOTIFICATION_IDS = [
  'engagement-add-friends-weekly',
  'engagement-birthdays-this-week',
  'engagement-tomorrow-birthday',
  'engagement-birthday-today',
  'engagement-upcoming-important',
  'engagement-missed-birthday',
] as const;

type EngagementSlot = {
  id: (typeof ENGAGEMENT_NOTIFICATION_IDS)[number];
  weekday: number;
  hour: number;
  minute: number;
  title: string;
  buildBody: (people: Person[]) => string;
};

const IMPORTANT_RELATIONSHIPS = new Set([
  'partner',
  'friend',
  'girlfriend',
  'boyfriend',
  'family',
]);

function getBirthdaysThisWeek(people: Person[]): Person[] {
  return people.filter((person) => {
    const days = getDaysUntilBirthday(person.birthDate);
    return days >= 0 && days <= 6;
  });
}

function getTomorrowBirthday(people: Person[]): Person | undefined {
  return people.find((person) => getDaysUntilBirthday(person.birthDate) === 1);
}

function getTodayBirthday(people: Person[]): Person | undefined {
  return people.find((person) => getDaysUntilBirthday(person.birthDate) === 0);
}

function getUpcomingImportantBirthday(people: Person[]): Person | undefined {
  const candidates = people.filter((person) => {
    const days = getDaysUntilBirthday(person.birthDate);
    return days > 0 && days <= 14 && IMPORTANT_RELATIONSHIPS.has(person.relationship);
  });

  if (candidates.length === 0) {
    return people.find((person) => {
      const days = getDaysUntilBirthday(person.birthDate);
      return days > 0 && days <= 14;
    });
  }

  return candidates.sort(
    (a, b) => getDaysUntilBirthday(a.birthDate) - getDaysUntilBirthday(b.birthDate),
  )[0];
}

function hadBirthdayYesterday(birthDate: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const { month, day } = parseBirthDateParts(birthDate);
  return yesterday.getMonth() + 1 === month && yesterday.getDate() === day;
}

function getMissedBirthday(people: Person[]): Person | undefined {
  return people.find((person) => hadBirthdayYesterday(person.birthDate));
}

const ENGAGEMENT_SLOTS: EngagementSlot[] = [
  {
    id: 'engagement-add-friends-weekly',
    weekday: 1,
    hour: 10,
    minute: 0,
    title: 'Add More Friends',
    buildBody: () => '🎉 Add more birthdays and never miss an important day.',
  },
  {
    id: 'engagement-birthdays-this-week',
    weekday: 2,
    hour: 9,
    minute: 0,
    title: 'Birthdays This Week',
    buildBody: (people) => {
      const count = getBirthdaysThisWeek(people).length;
      if (count === 0) {
        return '🎉 Check your birthday list and stay ahead of upcoming celebrations!';
      }
      return `🎉 You have ${count} birthday${count === 1 ? '' : 's'} coming up this week. Start planning now!`;
    },
  },
  {
    id: 'engagement-tomorrow-birthday',
    weekday: 3,
    hour: 9,
    minute: 0,
    title: "Tomorrow's Birthday",
    buildBody: (people) => {
      const person = getTomorrowBirthday(people);
      if (!person) {
        return '🎁 Check your list for upcoming birthdays and plan ahead!';
      }
      return `🎁 ${person.fullName}'s birthday is tomorrow. Don't forget to send wishes!`;
    },
  },
  {
    id: 'engagement-birthday-today',
    weekday: 4,
    hour: 9,
    minute: 0,
    title: 'Birthday Today',
    buildBody: (people) => {
      const person = getTodayBirthday(people);
      if (!person) {
        return '🎂 Open Birthday Buddy to see who is celebrating soon!';
      }
      return `🎂 It's ${person.fullName}'s birthday today! Send your wishes now.`;
    },
  },
  {
    id: 'engagement-upcoming-important',
    weekday: 5,
    hour: 9,
    minute: 0,
    title: 'Upcoming Important Birthday',
    buildBody: (people) => {
      const person = getUpcomingImportantBirthday(people);
      if (!person) {
        return '⭐ Keep your birthday list updated so you never miss someone special.';
      }
      const days = getDaysUntilBirthday(person.birthDate);
      return `⭐ ${person.fullName}'s birthday is only ${days} day${days === 1 ? '' : 's'} away.`;
    },
  },
  {
    id: 'engagement-missed-birthday',
    weekday: 6,
    hour: 9,
    minute: 0,
    title: 'Missed Birthday Alert',
    buildBody: (people) => {
      const person = getMissedBirthday(people);
      if (!person) {
        return '😅 Review your birthday list and send belated wishes if you missed anyone.';
      }
      return `😅 Oops! You missed ${person.fullName}'s birthday yesterday. Send a belated wish.`;
    },
  },
];

async function cancelEngagementNotifications(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  await Promise.all(
    ENGAGEMENT_NOTIFICATION_IDS.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined),
    ),
  );
}

export async function scheduleEngagementReminder(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  const granted = await registerForNotifications();
  if (!granted) return;

  const people = await peopleRepository.findAll(500, 0);

  await cancelEngagementNotifications();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('engagement', {
      name: 'Engagement Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  for (const slot of ENGAGEMENT_SLOTS) {
    await Notifications.scheduleNotificationAsync({
      identifier: slot.id,
      content: {
        title: slot.title,
        body: slot.buildBody(people),
        data: { type: 'engagement-reminder', engagementId: slot.id },
        ...(Platform.OS === 'android' ? { android: { channelId: 'engagement' } } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: slot.weekday,
        hour: slot.hour,
        minute: slot.minute,
        ...(Platform.OS === 'android' ? { channelId: 'engagement' } : {}),
      },
    });
  }
}

export async function cancelEngagementReminder(): Promise<void> {
  await cancelEngagementNotifications();
}
