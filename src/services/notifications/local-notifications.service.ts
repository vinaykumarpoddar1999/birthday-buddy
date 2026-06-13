import type { NotificationContentInput } from 'expo-notifications';
import { Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';
import { reminderRepository } from '@/repositories/reminder.repository';
import { handleApiError } from '@shared/errors';
import type { NotificationPreferences, ReminderSettings } from '@features/profile/types';
import {
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_REMINDER_SETTINGS,
} from '@/services/profile/profile.service';

import { isNotificationPermissionGranted } from './permission-utils';
import { ensureNotificationHandler } from './notification-init.utils';
import { getNotificationsModule } from './notifications-api';
import { scheduleEngagementReminder } from './engagement-reminder.service';

export type ScheduleBirthdayRemindersInput = {
  contactId: string;
  contactName: string;
  birthDate: string;
  reminderDaysBefore?: number[];
  notifyTime?: string;
  repeatYearly?: boolean;
};

type MonthDay = { month: number; day: number };

async function loadNotificationPrefs(): Promise<NotificationPreferences> {
  const raw = await settingsRepository.getJson<Partial<NotificationPreferences>>('notification_prefs');
  return { ...DEFAULT_NOTIFICATION_PREFS, ...raw };
}

async function loadReminderSettings(): Promise<ReminderSettings> {
  const appSettings = await settingsRepository.getAllSettings();
  const ext = await settingsRepository.getJson<Partial<ReminderSettings>>('reminder_settings_ext');
  const defaultTime =
    ext?.defaultTime ?? appSettings.reminderTime ?? DEFAULT_REMINDER_SETTINGS.defaultTime;
  return {
    ...DEFAULT_REMINDER_SETTINGS,
    ...ext,
    defaultTime,
    quietHoursStart:
      ext?.quietHoursStart ?? appSettings.quietHoursStart ?? DEFAULT_REMINDER_SETTINGS.quietHoursStart,
    quietHoursEnd:
      ext?.quietHoursEnd ?? appSettings.quietHoursEnd ?? DEFAULT_REMINDER_SETTINGS.quietHoursEnd,
    multipleReminderTimes:
      ext?.multipleReminderTimes?.length ? ext.multipleReminderTimes : [defaultTime],
  };
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [rawHours, rawMinutes] = time.split(':');
  const parsedHours = Number(rawHours);
  const parsedMinutes = Number(rawMinutes);
  const hours = Number.isFinite(parsedHours) ? Math.min(23, Math.max(0, parsedHours)) : 8;
  const minutes = Number.isFinite(parsedMinutes) ? Math.min(59, Math.max(0, parsedMinutes)) : 0;
  return { hours, minutes };
}

function timeToMinutes(time: string): number {
  const { hours, minutes } = parseTime(time);
  return hours * 60 + minutes;
}

/** Returns true if the given HH:mm falls inside quiet hours (supports overnight ranges). */
export function isWithinQuietHours(time: string, start: string, end: string): boolean {
  const t = timeToMinutes(time);
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  if (s === e) return false;
  if (s < e) return t >= s && t < e;
  return t >= s || t < e;
}

function shiftTimeOutOfQuietHours(
  time: string,
  quietStart: string,
  quietEnd: string,
): string {
  if (!isWithinQuietHours(time, quietStart, quietEnd)) return time;
  const { hours, minutes } = parseTime(quietEnd);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function parseBirthMonthDay(birthDate: string): MonthDay | null {
  const parts = birthDate.trim().split('-');
  if (parts.length >= 3) {
    const month = parseInt(parts[parts.length - 2]!, 10);
    const day = parseInt(parts[parts.length - 1]!, 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { month, day };
  }
  if (parts.length === 2) {
    const month = parseInt(parts[0]!, 10);
    const day = parseInt(parts[1]!, 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { month, day };
  }
  return null;
}

function subtractDays(month: number, day: number, daysBefore: number): MonthDay {
  const refYear = month === 2 && day === 29 ? 2024 : 2025;
  const date = new Date(refYear, month - 1, day);
  date.setDate(date.getDate() - daysBefore);
  return { month: date.getMonth() + 1, day: date.getDate() };
}

function adjustForWeekendRules(
  monthDay: MonthDay,
  rule: ReminderSettings['weekendRules'],
): MonthDay | null {
  const refYear = monthDay.month === 2 && monthDay.day === 29 ? 2024 : 2025;
  const date = new Date(refYear, monthDay.month - 1, monthDay.day);
  const dow = date.getDay();

  if (rule === 'skip' && (dow === 0 || dow === 6)) return null;

  if (rule === 'earlier') {
    if (dow === 6) date.setDate(date.getDate() - 1);
    if (dow === 0) date.setDate(date.getDate() - 2);
  }

  return { month: date.getMonth() + 1, day: date.getDate() };
}

function buildAdvanceContent(
  contactName: string,
  daysBefore: number,
  settings: ReminderSettings,
  AndroidNotificationPriority: typeof import('expo-notifications').AndroidNotificationPriority,
): NotificationContentInput {
  if (daysBefore === 0) {
    return {
      title: `🎉 Today is ${contactName}'s birthday!`,
      body: settings.birthdayAlarm
        ? "Don't forget to wish them — your birthday alarm is set!"
        : "Don't forget to wish them!",
      sound: settings.notificationSound ? 'default' : undefined,
      priority: settings.birthdayAlarm
        ? AndroidNotificationPriority.MAX
        : AndroidNotificationPriority.HIGH,
    };
  }

  return {
    title: `🎂 ${contactName}'s birthday is in ${daysBefore} day${daysBefore === 1 ? '' : 's'}!`,
    body: 'Open BirthdayBuddy to plan a wish or card.',
    sound: settings.notificationSound ? 'default' : undefined,
    priority: AndroidNotificationPriority.HIGH,
  };
}

function buildAlarmContent(
  contactName: string,
  settings: ReminderSettings,
  AndroidNotificationPriority: typeof import('expo-notifications').AndroidNotificationPriority,
): NotificationContentInput {
  return {
    title: `⏰ Birthday Alarm — ${contactName}`,
    body: "It's time to celebrate! Send your birthday wish now.",
    sound: settings.notificationSound ? 'default' : undefined,
    priority: AndroidNotificationPriority.MAX,
    categoryIdentifier: BIRTHDAY_ALARM_CATEGORY,
  };
}

export const BIRTHDAY_ALARM_CATEGORY = 'birthday-alarm-snooze';

const SNOOZE_ACTION_ID = 'snooze-1h';

export async function ensureBirthdayAlarmNotificationCategory(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  await Notifications.setNotificationCategoryAsync(BIRTHDAY_ALARM_CATEGORY, [
    {
      identifier: SNOOZE_ACTION_ID,
      buttonTitle: 'Snooze 1 hour',
      options: {
        opensAppToForeground: false,
      },
    },
  ]);
}

async function ensureAndroidChannels(settings: ReminderSettings): Promise<void> {
  if (Platform.OS !== 'android') return;
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  await Notifications.setNotificationChannelAsync('birthday-reminders', {
    name: 'Birthday Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: settings.notificationSound ? 'default' : undefined,
    vibrationPattern: settings.vibration ? [0, 250, 250, 250] : undefined,
  });

  await Notifications.setNotificationChannelAsync('birthday-alarms', {
    name: 'Birthday Alarms',
    importance: Notifications.AndroidImportance.MAX,
    sound: settings.notificationSound ? 'default' : undefined,
    bypassDnd: true,
    vibrationPattern: settings.vibration ? [0, 500, 200, 500] : undefined,
  });

  await Notifications.setNotificationChannelAsync('default', {
    name: 'General',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function registerForNotifications(): Promise<boolean> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return false;

  await ensureNotificationHandler();

  const existing = await Notifications.getPermissionsAsync();
  if (isNotificationPermissionGranted(existing)) {
    const settings = await loadReminderSettings();
    await ensureBirthdayAlarmNotificationCategory();
    await ensureAndroidChannels(settings);
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  if (isNotificationPermissionGranted(requested)) {
    const settings = await loadReminderSettings();
    await ensureBirthdayAlarmNotificationCategory();
    await ensureAndroidChannels(settings);
    return true;
  }
  return false;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const prefs = await loadNotificationPrefs();
  if (!prefs.pushNotifications) return false;
  return registerForNotifications();
}

/** Android requires all notification data values to be strings. */
export function toNotificationData(data: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value == null ? '' : String(value)]),
  );
}

async function scheduleCalendarNotification(
  content: NotificationContentInput,
  monthDay: MonthDay,
  time: string,
  channelId: string,
  data: Record<string, unknown>,
): Promise<string> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return '';

  const { hours, minutes } = parseTime(time);

  return Notifications.scheduleNotificationAsync({
    content: {
      ...content,
      ...(Platform.OS === 'android' ? { android: { channelId } } : {}),
      data: toNotificationData(data),
    },
    trigger:
      Platform.OS === 'android'
        ? {
            type: Notifications.SchedulableTriggerInputTypes.YEARLY,
            month: monthDay.month - 1,
            day: monthDay.day,
            hour: hours,
            minute: minutes,
            channelId,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            month: monthDay.month,
            day: monthDay.day,
            hour: hours,
            minute: minutes,
            repeats: true,
          },
  });
}

export async function scheduleBirthdayReminders(
  input: ScheduleBirthdayRemindersInput,
): Promise<string[]> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return [];

  const [prefs, reminderSettings] = await Promise.all([
    loadNotificationPrefs(),
    loadReminderSettings(),
  ]);

  if (!prefs.birthdayAlerts) {
    return [];
  }

  const granted = await registerForNotifications();
  if (!granted) {
    return [];
  }

  if (input.repeatYearly === false) {
    return [];
  }

  const birth = parseBirthMonthDay(input.birthDate);
  if (!birth) return [];

  await ensureBirthdayAlarmNotificationCategory();
  await ensureAndroidChannels(reminderSettings);

  const personOffsets = input.reminderDaysBefore ?? [];
  const scheduledIds: string[] = [];
  const scheduledKeys = new Set<string>();
  const { AndroidNotificationPriority } = Notifications;

  type SchedulePair = { daysBefore: number; time: string };

  const globalPairs: SchedulePair[] =
    reminderSettings.reminderEntries?.length > 0
      ? reminderSettings.reminderEntries.map((entry) => ({
          daysBefore: entry.daysBefore,
          time: entry.time,
        }))
      : (reminderSettings.reminderDaysBefore.length
          ? reminderSettings.reminderDaysBefore
          : [7, 3, 1, 0]
        ).flatMap((daysBefore) => {
          const times =
            reminderSettings.timingMode === 'flexible' &&
            reminderSettings.multipleReminderTimes.length > 0
              ? reminderSettings.multipleReminderTimes
              : [input.notifyTime ?? reminderSettings.defaultTime];
          return times.map((time) => ({ daysBefore, time }));
        });

  const personPairs: SchedulePair[] = personOffsets.map((daysBefore) => ({
    daysBefore,
    time: input.notifyTime ?? reminderSettings.defaultTime,
  }));

  const schedulePairs: SchedulePair[] = [...globalPairs, ...personPairs];

  const hasSameDayReminder = schedulePairs.some((pair) => pair.daysBefore === 0);
  if (!hasSameDayReminder) {
    schedulePairs.push({
      daysBefore: 0,
      time: input.notifyTime ?? reminderSettings.defaultTime,
    });
  }

  try {
    for (const pair of schedulePairs) {
      const { daysBefore } = pair;
      let time = shiftTimeOutOfQuietHours(
        pair.time,
        reminderSettings.quietHoursStart,
        reminderSettings.quietHoursEnd,
      );

      let triggerMonthDay = subtractDays(birth.month, birth.day, daysBefore);
      const adjusted = adjustForWeekendRules(triggerMonthDay, reminderSettings.weekendRules);
      if (!adjusted) continue;
      triggerMonthDay = adjusted;

      const key = `${triggerMonthDay.month}-${triggerMonthDay.day}-${time}-advance-${daysBefore}`;
      if (scheduledKeys.has(key)) continue;
      scheduledKeys.add(key);

      const content = buildAdvanceContent(
        input.contactName,
        daysBefore,
        reminderSettings,
        AndroidNotificationPriority,
      );
      const channelId =
        daysBefore === 0 && reminderSettings.birthdayAlarm ? 'birthday-alarms' : 'birthday-reminders';

      const id = await scheduleCalendarNotification(
        content,
        triggerMonthDay,
        time,
        channelId,
        {
          contactId: input.contactId,
          contactName: input.contactName,
          daysBefore,
          type: daysBefore === 0 ? 'day_of' : 'advance',
          alarm: reminderSettings.birthdayAlarm,
        },
      );
      if (id) scheduledIds.push(id);
    }

    if (reminderSettings.birthdayAlarm) {
      const alarmTimes =
        reminderSettings.reminderEntries?.length > 0
          ? [...new Set(reminderSettings.reminderEntries.filter((e) => e.daysBefore === 0).map((e) => e.time))]
          : reminderSettings.multipleReminderTimes.length > 0
            ? reminderSettings.multipleReminderTimes
            : [input.notifyTime ?? reminderSettings.defaultTime];

      for (let alarmTime of alarmTimes) {
        alarmTime = shiftTimeOutOfQuietHours(
          alarmTime,
          reminderSettings.quietHoursStart,
          reminderSettings.quietHoursEnd,
        );
        const adjusted = adjustForWeekendRules(birth, reminderSettings.weekendRules) ?? birth;
        const key = `${adjusted.month}-${adjusted.day}-${alarmTime}-alarm`;
        if (scheduledKeys.has(key)) continue;
        scheduledKeys.add(key);

        const id = await scheduleCalendarNotification(
          buildAlarmContent(input.contactName, reminderSettings, AndroidNotificationPriority),
          adjusted,
          alarmTime,
          'birthday-alarms',
          {
            contactId: input.contactId,
            contactName: input.contactName,
            daysBefore: 0,
            type: 'alarm',
            alarm: true,
          } as Record<string, unknown>,
        );
        if (id) scheduledIds.push(id);
      }
    }
  } catch (error) {
    throw handleApiError(error);
  }

  return scheduledIds;
}

export async function cancelScheduledNotifications(ids: string[]): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  await Promise.all(
    ids.filter(Boolean).map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

export async function cancelEveryScheduledNotification(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelAllScheduledBirthdayNotifications(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  const trackedIds = await reminderRepository.getAllActiveNotificationIds();
  await cancelScheduledNotifications(trackedIds);

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const birthdayIds = scheduled
    .filter((entry) => {
      const data = entry.content.data as Record<string, unknown> | undefined;
      return data?.type !== 'engagement-reminder';
    })
    .map((entry) => entry.identifier);

  await cancelScheduledNotifications(birthdayIds);
}

export async function getAllScheduledNotificationIds(): Promise<string[]> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return [];
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.map((n) => n.identifier);
}

export async function rescheduleAllBirthdayReminders(
  people: {
    id: string;
    fullName: string;
    birthDate: string;
    reminderDaysBefore?: number;
    reminderTime?: string;
    repeatYearly?: boolean;
  }[],
): Promise<void> {
  await cancelAllScheduledBirthdayNotifications();

  for (const person of people) {
    const offsets =
      person.reminderDaysBefore !== undefined && person.reminderDaysBefore !== null
        ? [person.reminderDaysBefore]
        : undefined;
    await scheduleBirthdayReminders({
      contactId: person.id,
      contactName: person.fullName,
      birthDate: person.birthDate,
      reminderDaysBefore: offsets,
      notifyTime: person.reminderTime,
      repeatYearly: person.repeatYearly !== false,
    });
  }

  await scheduleEngagementReminder();
}
