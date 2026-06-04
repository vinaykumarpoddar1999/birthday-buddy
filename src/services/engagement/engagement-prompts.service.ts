import Constants from 'expo-constants';
import { Linking, Platform } from 'react-native';

import { settingsRepository } from '@/repositories/settings.repository';
import { peopleService } from '@/services/people/people.service';
import { useModalStore } from '@/stores/modal.store';
import { usePremiumStore } from '@/stores/premium.store';
import { useAuthStore } from '@/stores/auth.store';

import {
  hasEnteredMainApp,
  isOnAuthRoute,
  isOnMainAppRoute,
  markMainAppEntered,
} from './engagement-context';

const KEYS = {
  lastPremiumPrompt: 'engagement_last_premium_prompt',
  lastRatePrompt: 'engagement_last_rate_prompt',
  lastUpdatePrompt: 'engagement_last_update_prompt',
  lastAnyPrompt: 'engagement_last_any_prompt',
  rateDismissedUntil: 'engagement_rate_dismissed_until',
  mainAppEnteredAt: 'engagement_main_app_entered_at',
  promptRotationIndex: 'engagement_prompt_rotation_index',
} as const;

const MIN_DAYS_PREMIUM = 1;
const MIN_DAYS_RATE = 1;
const MIN_DAYS_UPDATE = 7;
const MIN_DAYS_BETWEEN_ANY = 1;
const MIN_PEOPLE_COUNT = 2;

type PromptType = 'premium' | 'rate' | 'update';

const PROMPT_ROTATION: PromptType[] = ['premium', 'rate', 'update'];

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(isoDate: string | null): number {
  if (!isoDate) return 999;
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function isEligibleForType(lastShown: string | null, minDays: number): boolean {
  if (lastShown === todayKey()) return false;
  return daysBetween(lastShown) >= minDays;
}

export function getAppVersion(): string {
  return Constants.expoConfig?.version ?? '1.0.0';
}

export function getLatestAvailableVersion(): string {
  const extra = Constants.expoConfig?.extra as { latestVersion?: string } | undefined;
  return extra?.latestVersion ?? getAppVersion();
}

export function isUpdateAvailable(): boolean {
  return getLatestAvailableVersion() !== getAppVersion();
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

async function markAnyShownToday(): Promise<void> {
  await markShownToday(KEYS.lastAnyPrompt);
}

async function ensureMainAppEnteredPersisted(): Promise<boolean> {
  if (hasEnteredMainApp()) return true;
  const stored = await settingsRepository.get(KEYS.mainAppEnteredAt);
  if (stored) {
    markMainAppEntered();
    return true;
  }
  return false;
}

/** Call when user first lands on main tabs — enables engagement prompts. */
export async function recordMainAppEntry(): Promise<void> {
  if (hasEnteredMainApp()) return;
  markMainAppEntered();
  await settingsRepository.set(KEYS.mainAppEnteredAt, new Date().toISOString());
  void evaluateEngagementPrompts();
}

function shouldSkipEngagement(): boolean {
  const authState = useAuthStore.getState().authState;
  if (
    authState === 'setup_required' ||
    authState === 'unauthenticated' ||
    authState === 'session_recovery'
  ) {
    return true;
  }
  if (isOnAuthRoute()) return true;
  if (!isOnMainAppRoute() && !hasEnteredMainApp()) return true;
  return false;
}

async function getRotationStartIndex(): Promise<number> {
  const raw = await settingsRepository.get(KEYS.promptRotationIndex);
  const parsed = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed % PROMPT_ROTATION.length : 0;
}

async function advanceRotation(): Promise<void> {
  const start = await getRotationStartIndex();
  await settingsRepository.set(KEYS.promptRotationIndex, String((start + 1) % PROMPT_ROTATION.length));
}

async function isRateSuppressed(): Promise<boolean> {
  const rateDismissedUntil = await settingsRepository.get(KEYS.rateDismissedUntil);
  return Boolean(rateDismissedUntil && new Date(rateDismissedUntil).getTime() > Date.now());
}

async function isTypeEligible(type: PromptType): Promise<boolean> {
  const isPremium = usePremiumStore.getState().isPremium;

  if (type === 'premium') {
    if (isPremium) return false;
    const lastPremium = await settingsRepository.get(KEYS.lastPremiumPrompt);
    return isEligibleForType(lastPremium, MIN_DAYS_PREMIUM);
  }

  if (type === 'rate') {
    if (await isRateSuppressed()) return false;
    const lastRate = await settingsRepository.get(KEYS.lastRatePrompt);
    return isEligibleForType(lastRate, MIN_DAYS_RATE);
  }

  if (type === 'update') {
    if (!isUpdateAvailable()) return false;
    const lastUpdate = await settingsRepository.get(KEYS.lastUpdatePrompt);
    return isEligibleForType(lastUpdate, MIN_DAYS_UPDATE);
  }

  return false;
}

async function showPrompt(type: PromptType): Promise<void> {
  useModalStore.getState().openModal(type);
  if (type === 'premium') await markShownToday(KEYS.lastPremiumPrompt);
  if (type === 'rate') await markShownToday(KEYS.lastRatePrompt);
  if (type === 'update') await markShownToday(KEYS.lastUpdatePrompt);
  await markAnyShownToday();
  await advanceRotation();
}

export async function evaluateEngagementPrompts(): Promise<void> {
  const { activeModal } = useModalStore.getState();
  if (activeModal) return;

  if (shouldSkipEngagement()) return;

  const mainEntered = await ensureMainAppEnteredPersisted();
  if (!mainEntered) return;

  const peopleCount = await peopleService.count();
  if (peopleCount < MIN_PEOPLE_COUNT) return;

  const lastAny = await settingsRepository.get(KEYS.lastAnyPrompt);
  if (daysBetween(lastAny) < MIN_DAYS_BETWEEN_ANY) return;

  const rotationStart = await getRotationStartIndex();
  const ordered = [
    ...PROMPT_ROTATION.slice(rotationStart),
    ...PROMPT_ROTATION.slice(0, rotationStart),
  ];

  for (const type of ordered) {
    if (await isTypeEligible(type)) {
      await showPrompt(type);
      return;
    }
  }
}

export async function dismissRatePromptForDays(days: number): Promise<void> {
  const until = new Date();
  until.setDate(until.getDate() + days);
  await settingsRepository.set(KEYS.rateDismissedUntil, until.toISOString());
}

let foregroundEvaluateTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced evaluate on app foreground (main app only). */
export function scheduleEngagementEvaluateOnForeground(): void {
  if (foregroundEvaluateTimer) clearTimeout(foregroundEvaluateTimer);
  foregroundEvaluateTimer = setTimeout(() => {
    foregroundEvaluateTimer = null;
    void evaluateEngagementPrompts();
  }, 1500);
}
