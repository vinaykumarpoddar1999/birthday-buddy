import Constants from 'expo-constants';
import { Linking, Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';
import { useModalStore } from '@/stores/modal.store';
import { usePremiumStore } from '@/stores/premium.store';

const KEYS = {
  lastPremiumPrompt: 'engagement_last_premium_prompt',
  lastRatePrompt: 'engagement_last_rate_prompt',
  lastUpdatePrompt: 'engagement_last_update_prompt',
  rateDismissedUntil: 'engagement_rate_dismissed_until',
} as const;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(isoDate: string | null): number {
  if (!isoDate) return 999;
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export function getStoreUrl(): string {
  const config = Constants.expoConfig;
  const iosBundleId = config?.ios?.bundleIdentifier ?? 'com.birthdaybuddy.app';
  const androidPackage = config?.android?.package ?? iosBundleId;
  const iosAppId = (config?.extra as { iosAppId?: string } | undefined)?.iosAppId;

  if (Platform.OS === 'ios' && iosAppId) {
    return `https://apps.apple.com/app/id${iosAppId}`;
  }
  if (Platform.OS === 'android') {
    return `https://play.google.com/store/apps/details?id=${androidPackage}`;
  }
  return 'https://birthdaybuddy.app';
}

export async function openAppStore(): Promise<void> {
  const url = getStoreUrl();
  if (await Linking.canOpenURL(url)) {
    await Linking.openURL(url);
  }
}

async function markShownToday(key: string): Promise<void> {
  await settingsRepository.set(key, todayKey());
}

export async function evaluateEngagementPrompts(): Promise<void> {
  const { activeModal } = useModalStore.getState();
  if (activeModal) return;

  const isPremium = usePremiumStore.getState().isPremium;

  const lastPremium = await settingsRepository.get(KEYS.lastPremiumPrompt);
  if (!isPremium && lastPremium !== todayKey()) {
    useModalStore.getState().openModal('premium');
    await markShownToday(KEYS.lastPremiumPrompt);
    return;
  }

  const rateDismissedUntil = await settingsRepository.get(KEYS.rateDismissedUntil);
  const rateSuppressed =
    rateDismissedUntil && new Date(rateDismissedUntil).getTime() > Date.now();

  if (!rateSuppressed) {
    const lastRate = await settingsRepository.get(KEYS.lastRatePrompt);
    if (lastRate !== todayKey()) {
      useModalStore.getState().openModal('rate');
      await markShownToday(KEYS.lastRatePrompt);
      return;
    }
  }

  const lastUpdate = await settingsRepository.get(KEYS.lastUpdatePrompt);
  if (daysBetween(lastUpdate) >= 7) {
    useModalStore.getState().openModal('update');
    await markShownToday(KEYS.lastUpdatePrompt);
  }
}

export async function dismissRatePromptForDays(days: number): Promise<void> {
  const until = new Date();
  until.setDate(until.getDate() + days);
  await settingsRepository.set(KEYS.rateDismissedUntil, until.toISOString());
}
