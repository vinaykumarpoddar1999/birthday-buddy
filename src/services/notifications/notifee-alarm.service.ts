import Constants from 'expo-constants';
import { Platform } from 'react-native';

import {
  parseAlarmPayload,
  useBirthdayAlarmStore,
} from '@/services/notifications/birthday-alarm.service';

const ALARM_CHANNEL_ID = 'birthday-alarms-fullscreen';
const isExpoGo = Constants.appOwnership === 'expo';

type NotifeeModule = typeof import('@notifee/react-native');
type NotifeeEvent = import('@notifee/react-native').Event;

let notifeeModule: NotifeeModule | null = null;
let notifeeLoadFailed = false;

async function getNotifeeModule(): Promise<NotifeeModule | null> {
  if (isExpoGo || notifeeLoadFailed) return null;
  if (notifeeModule) return notifeeModule;
  try {
    notifeeModule = await import('@notifee/react-native');
    return notifeeModule;
  } catch (error) {
    notifeeLoadFailed = true;
    if (__DEV__) {
      console.warn('[notifee] Failed to load native module:', error);
    }
    return null;
  }
}

export async function ensureNotifeeAlarmChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const mod = await getNotifeeModule();
  if (!mod) return;

  await mod.default.createChannel({
    id: ALARM_CHANNEL_ID,
    name: 'Birthday Alarms',
    importance: mod.AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
    bypassDnd: true,
  });
}

export async function displayFullScreenBirthdayAlarm(
  contactId: string,
  contactName: string,
): Promise<void> {
  const mod = await getNotifeeModule();
  if (!mod) return;

  await ensureNotifeeAlarmChannel();

  await mod.default.displayNotification({
    id: `alarm-${contactId}-${Date.now()}`,
    title: `Birthday Alarm — ${contactName}`,
    body: "It's celebration time! Send your birthday wish now.",
    data: {
      contactId,
      contactName,
      type: 'alarm',
      alarm: 'true',
      daysBefore: '0',
    },
    android: {
      channelId: ALARM_CHANNEL_ID,
      category: mod.AndroidCategory.ALARM,
      importance: mod.AndroidImportance.HIGH,
      pressAction: { id: 'default', launchActivity: 'default' },
      fullScreenAction: {
        id: 'alarm-fullscreen',
        launchActivity: 'default',
      },
      sound: 'default',
      loopSound: true,
      vibrationPattern: [0, 500, 200, 500, 200, 500],
      lightUpScreen: true,
      autoCancel: false,
    },
    ios: {
      sound: 'default',
      interruptionLevel: 'timeSensitive',
    },
  });
}

function handleNotifeeEvent(event: NotifeeEvent): void {
  const { type, detail } = event;

  if (!notifeeModule) return;

  const { EventType } = notifeeModule;
  if (
    type !== EventType.PRESS &&
    type !== EventType.ACTION_PRESS &&
    type !== EventType.DELIVERED &&
    type !== EventType.DISMISSED
  ) {
    return;
  }

  const data = detail.notification?.data as Record<string, unknown> | undefined;
  const alarm = parseAlarmPayload(data);
  if (!alarm) return;

  if (type === EventType.DISMISSED) {
    useBirthdayAlarmStore.getState().dismiss();
    return;
  }

  useBirthdayAlarmStore.getState().showOverlay(alarm);
}

let listenersRegistered = false;

export function registerNotifeeAlarmListeners(): void {
  if (listenersRegistered || isExpoGo) return;
  listenersRegistered = true;

  void getNotifeeModule().then((mod) => {
    if (!mod) return;
    mod.default.onForegroundEvent(handleNotifeeEvent);
  });
}

export function isNotifeeAvailable(): boolean {
  return !isExpoGo;
}
