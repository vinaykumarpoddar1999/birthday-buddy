import * as Crypto from 'expo-crypto';

const ADJECTIVES = ['magic', 'golden', 'sparkle', 'dream', 'love', 'happy', 'star', 'sweet', 'cosmic', 'royal'];
const NOUNS = ['surprise', 'moment', 'gift', 'memory', 'wish', 'celebration', 'treasure', 'journey', 'story', 'heart'];

export async function generateSlug(): Promise<string> {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const bytes = await Crypto.getRandomBytesAsync(3);
  const suffix = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 5);
  return `${adj}-${noun}-${suffix}`;
}

export async function generateExperienceId(): Promise<string> {
  return Crypto.randomUUID();
}

export function buildShareLink(slug: string): string {
  return `https://birthdaybuddy.app/s/${slug}`;
}

export function buildShortUrl(slug: string): string {
  return `https://bb.link/${slug}`;
}

export function buildDeepLink(slug: string): string {
  return `birthdaybuddy://surprise/${slug}`;
}

/** Primary share URL — deep link opens in-app viewer; web URL for future hosted experiences. */
export function buildPrimaryShareUrl(slug: string): string {
  return buildDeepLink(slug);
}
