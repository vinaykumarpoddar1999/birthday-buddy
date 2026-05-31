import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import { handleApiError } from '@shared/errors';

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const granted = (await Notifications.getPermissionsAsync()).status;
  if (granted !== 'granted') {
    const requested = (await Notifications.requestPermissionsAsync()).status;
    if (requested !== 'granted') {
      return null;
    }
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

export async function saveDeviceToken(userId: string, token: string): Promise<void> {
  const platform = Platform.OS;

  const { error } = await supabase.from('device_tokens').upsert(
    {
      user_id: userId,
      token,
      platform,
    },
    { onConflict: 'user_id,token' },
  );

  if (error) {
    throw handleApiError(error);
  }
}

export async function syncPushToken(userId: string): Promise<string | null> {
  try {
    const token = await registerForPushNotifications();
    if (!token) return null;
    await saveDeviceToken(userId, token);
    return token;
  } catch (error) {
    throw handleApiError(error);
  }
}
