import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';
import { profileService } from '@/services/profile/profile.service';
import type { AppIconOption } from '@features/profile/types';

const APP_ICON_KEY = 'app_icon';

/** Maps app icon options to native alternate icon names when configured in the build. */
const NATIVE_ICON_NAMES: Partial<Record<AppIconOption, string | null>> = {
  classic: null,
  premium: 'Premium',
  gift: 'Gift',
  cake: 'Cake',
  party: 'Party',
};

type AlternateIconModule = {
  setAlternateIconAsync?: (name: string | null) => Promise<void>;
  getAlternateIconAsync?: () => Promise<string | null>;
  supportsAlternateIcons?: boolean;
};

async function trySetNativeIcon(icon: AppIconOption): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const nativeName = NATIVE_ICON_NAMES[icon];
  if (nativeName === undefined) return false;

  try {
    // Optional native module — only present when alternate icons are configured in the build.
    const mod = require('expo-alternate-app-icons') as AlternateIconModule;
    if (!mod?.setAlternateIconAsync) return false;
    if (mod.supportsAlternateIcons === false) return false;
    await mod.setAlternateIconAsync(nativeName);
    return true;
  } catch {
    return false;
  }
}

export type SetAppIconResult = {
  saved: boolean;
  nativeApplied: boolean;
};

export class AppIconService {
  async setIcon(icon: AppIconOption): Promise<SetAppIconResult> {
    await settingsRepository.set(APP_ICON_KEY, icon);
    await profileService.saveBundle({ appIcon: icon });

    if (Platform.OS === 'web' || Constants.appOwnership === 'expo') {
      return { saved: true, nativeApplied: false };
    }

    const nativeApplied = await trySetNativeIcon(icon);
    return { saved: true, nativeApplied };
  }

  async getCurrentIcon(): Promise<AppIconOption> {
    const raw = await settingsRepository.get(APP_ICON_KEY);
    const valid: AppIconOption[] = ['classic', 'premium', 'gift', 'cake', 'party'];
    return valid.includes(raw as AppIconOption) ? (raw as AppIconOption) : 'classic';
  }
}

export const appIconService = new AppIconService();
