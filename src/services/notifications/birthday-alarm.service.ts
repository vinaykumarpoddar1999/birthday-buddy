import { Platform, Vibration } from 'react-native';
import { create } from 'zustand';

import {
  startBirthdayAlarmAudio,
  stopBirthdayAlarmAudio,
} from './birthday-alarm-audio.service';
import { getNotificationsModule } from './notifications-api';
import { BIRTHDAY_ALARM_CATEGORY, toNotificationData } from './local-notifications.service';

const SNOOZE_ACTION_ID = 'snooze-1h';
const ALARM_VIBRATION_PATTERN = [0, 800, 400, 800, 400, 800, 400, 1200];

type ActiveAlarm = {
  contactId: string;
  contactName: string;
};

type BirthdayAlarmState = {
  active: ActiveAlarm | null;
  showOverlay: (alarm: ActiveAlarm) => void;
  dismiss: () => void;
};

let vibrationInterval: ReturnType<typeof setInterval> | null = null;

function startVibrationLoop(): void {
  stopVibrationLoop();
  if (Platform.OS === 'android') {
    Vibration.vibrate(ALARM_VIBRATION_PATTERN, true);
    return;
  }
  Vibration.vibrate(ALARM_VIBRATION_PATTERN);
  vibrationInterval = setInterval(() => {
    Vibration.vibrate(ALARM_VIBRATION_PATTERN);
  }, 4000);
}

function stopVibrationLoop(): void {
  if (vibrationInterval) {
    clearInterval(vibrationInterval);
    vibrationInterval = null;
  }
  Vibration.cancel();
}

export const useBirthdayAlarmStore = create<BirthdayAlarmState>((set) => ({
  active: null,
  showOverlay: (alarm) => {
    startVibrationLoop();
    void startBirthdayAlarmAudio();
    set({ active: alarm });
  },
  dismiss: () => {
    stopVibrationLoop();
    void stopBirthdayAlarmAudio();
    set({ active: null });
  },
}));

export async function snoozeBirthdayAlarm(contactId: string, contactName: string): Promise<void> {
  useBirthdayAlarmStore.getState().dismiss();
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  const trigger = new Date(Date.now() + 60 * 60 * 1000);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `⏰ Birthday Alarm — ${contactName}`,
      body: 'Snoozed reminder — time to celebrate!',
      sound: 'default',
      categoryIdentifier: BIRTHDAY_ALARM_CATEGORY,
      data: toNotificationData({ contactId, contactName, type: 'alarm', alarm: true }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
  });
}

export function parseAlarmPayload(
  data: Record<string, unknown> | undefined,
): ActiveAlarm | null {
  if (!data) return null;
  const alarmFlag = data.alarm === true || data.alarm === 'true';
  const isAlarm = data.type === 'alarm' || (data.type === 'day_of' && alarmFlag);
  if (!isAlarm) return null;
  const contactId = typeof data.contactId === 'string' ? data.contactId : '';
  const contactName = typeof data.contactName === 'string' ? data.contactName : 'Someone special';
  if (!contactId && !contactName) return null;
  return { contactId, contactName };
}

export { SNOOZE_ACTION_ID };
