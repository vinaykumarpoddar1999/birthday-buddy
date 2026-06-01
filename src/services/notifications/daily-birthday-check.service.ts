import { getDaysUntilBirthday } from '@features/people/utils/birthday-utils';

import { peopleRepository } from '@/repositories/people.repository';
import { settingsRepository } from '@/repositories/settings.repository';
import { appNotificationService } from '@/services/notifications/app-notification.service';
import {
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_REMINDER_SETTINGS,
} from '@/services/profile/profile.service';

const LAST_DAILY_CHECK_KEY = 'last_daily_birthday_check';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export class DailyBirthdayCheckService {
  async run(): Promise<void> {
    const lastCheck = await settingsRepository.get(LAST_DAILY_CHECK_KEY);
    const today = todayKey();
    if (lastCheck === today) return;

    const prefsRaw = await settingsRepository.getJson<Partial<typeof DEFAULT_NOTIFICATION_PREFS>>(
      'notification_prefs',
    );
    const prefs = { ...DEFAULT_NOTIFICATION_PREFS, ...prefsRaw };
    if (!prefs.birthdayAlerts || !prefs.activityUpdates) {
      await settingsRepository.set(LAST_DAILY_CHECK_KEY, today);
      return;
    }

    const ext = await settingsRepository.getJson<Partial<typeof DEFAULT_REMINDER_SETTINGS>>(
      'reminder_settings_ext',
    );
    const reminderOffsets = ext?.reminderDaysBefore?.length
      ? ext.reminderDaysBefore
      : DEFAULT_REMINDER_SETTINGS.reminderDaysBefore;

    const people = await peopleRepository.findAll(500, 0);
    const existing = await appNotificationService.list(100);
    const existingKeys = new Set(
      existing.map((n) => `${n.title}-${n.timestamp.slice(0, 10)}`),
    );

    for (const person of people) {
      const daysUntil = getDaysUntilBirthday(person.birthDate);

      if (daysUntil === 0) {
        const title = `🎉 ${person.fullName}'s birthday is today!`;
        const key = `${title}-${today}`;
        if (!existingKeys.has(key)) {
          await appNotificationService.add({
            type: 'birthday',
            title,
            message: "Don't forget to send a wish or create a card!",
          });
        }
        continue;
      }

      if (reminderOffsets.includes(daysUntil)) {
        const title = `🎂 ${person.fullName}'s birthday in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
        const key = `${title}-${today}`;
        if (!existingKeys.has(key)) {
          await appNotificationService.add({
            type: 'reminder',
            title,
            message: 'Plan ahead with AI wishes or Card Studio.',
          });
        }
      }
    }

    await settingsRepository.set(LAST_DAILY_CHECK_KEY, today);
  }
}

export const dailyBirthdayCheckService = new DailyBirthdayCheckService();
