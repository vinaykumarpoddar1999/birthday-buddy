import { settingsStorage } from '@/lib/mmkv';
import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

const SETTINGS_KEY = 'app_settings';

export function loadSettings(): AppSettings {
  const raw = settingsStorage.getString(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  settingsStorage.set(SETTINGS_KEY, JSON.stringify(settings));
}
