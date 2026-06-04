import { settingsRepository } from '@/repositories/settings.repository';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function confettiKey(personId: string): string {
  return `confetti_shown_${todayKey()}_${personId}`;
}

export async function shouldShowBirthdayConfetti(personId: string): Promise<boolean> {
  const key = confettiKey(personId);
  const shown = await settingsRepository.get(key);
  return !shown;
}

export async function markBirthdayConfettiShown(personId: string): Promise<void> {
  await settingsRepository.set(confettiKey(personId), '1');
}
