import type {
  GeneratedWish,
  WishLanguage,
  WishLength,
  WishRelationship,
  WishTemplate,
  WishTone,
  WishToneData,
} from '../types';

let allWishData: WishToneData[] = [];

export function registerWishData(data: WishToneData): void {
  const existing = allWishData.findIndex((d) => d.tone === data.tone);
  if (existing >= 0) {
    allWishData[existing] = data;
  } else {
    allWishData.push(data);
  }
}

export function getWishDataForTone(tone: WishTone): WishToneData | undefined {
  return allWishData.find((d) => d.tone === tone);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const usedWishIds = new Set<string>();

function mapRelationship(rel: string): WishRelationship {
  const map: Record<string, WishRelationship> = {
    friend: 'friend',
    family: 'family',
    partner: 'partner',
    colleague: 'colleague',
    relative: 'relative',
  };
  return map[rel] || 'general';
}

function personalizeWish(
  text: string,
  name: string,
  context?: string,
): string {
  let result = text.replace(/\{\{name\}\}/g, name || 'Friend');

  if (context && context.trim()) {
    const contextParts = context
      .split(/[.,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (contextParts.length > 0) {
      const contextSuffix = contextParts
        .map((part) => {
          if (/love|loves|enjoy|enjoys|like|likes/i.test(part)) {
            return part.replace(/^(she|he|they)\s+/i, '').trim();
          }
          return part;
        })
        .filter((p) => p.length > 3);

      if (contextSuffix.length > 0) {
        const hint = pickRandom(contextSuffix);
        const connectors = [
          `\n\nP.S. I know you ${hint.toLowerCase()} — here's to celebrating that! `,
          `\n\nRemembering how much you ${hint.toLowerCase()} makes this wish even more special! `,
          `\n\nSince you ${hint.toLowerCase()}, may this year bring even more of that joy! `,
        ];
        result += pickRandom(connectors);
      }
    }
  }

  return result;
}

const LANGUAGE_GREETINGS: Record<string, string[]> = {
  hindi: [
    'जन्मदिन मुबारक हो, {{name}}!\n\n',
    'प्रिय {{name}}, जन्मदिन की हार्दिक शुभकामनाएं!\n\n',
    '{{name}} को जन्मदिन की ढेर सारी बधाई!\n\n',
  ],
  bengali: [
    'শুভ জন্মদিন, {{name}}!\n\n',
    'প্রিয় {{name}}, জন্মদিনের অনেক শুভেচ্ছা!\n\n',
    '{{name}}, তোমার জন্মদিনে অনেক ভালোবাসা!\n\n',
  ],
  spanish: [
    '¡Feliz cumpleaños, {{name}}!\n\n',
    'Querido/a {{name}}, ¡muchas felicidades en tu día!\n\n',
    '{{name}}, ¡que este día sea tan especial como tú!\n\n',
  ],
  french: [
    'Joyeux anniversaire, {{name}}!\n\n',
    'Cher/Chère {{name}}, je te souhaite un merveilleux anniversaire!\n\n',
    '{{name}}, que cette journée soit aussi belle que toi!\n\n',
  ],
  german: [
    'Alles Gute zum Geburtstag, {{name}}!\n\n',
    'Liebe/r {{name}}, herzlichen Glückwunsch zum Geburtstag!\n\n',
    '{{name}}, möge dein neues Lebensjahr wunderbar werden!\n\n',
  ],
};

function applyLanguage(text: string, language: WishLanguage, name: string): string {
  if (language === 'english') return text;

  const greetings = LANGUAGE_GREETINGS[language];
  if (!greetings) return text;

  const greeting = pickRandom(greetings).replace(/\{\{name\}\}/g, name);
  return `${greeting}${text}`;
}

function stripEmojis(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.!?,;:])/g, '$1')
    .trim();
}

export interface GenerateWishParams {
  tone: WishTone;
  length: WishLength;
  language: WishLanguage;
  personId: string;
  personName: string;
  relationship: string;
  personalContext?: string;
  age?: number;
}

export function generateWish(params: GenerateWishParams): GeneratedWish {
  const {
    tone,
    length,
    language,
    personId,
    personName,
    relationship,
    personalContext,
  } = params;

  const toneData = getWishDataForTone(tone);
  const wishRelationship = mapRelationship(relationship);

  let pool: WishTemplate[] = [];

  if (toneData) {
    const exact = toneData.wishes.filter(
      (w) =>
        w.lengthCategory === length &&
        w.relationship === wishRelationship &&
        !usedWishIds.has(w.id),
    );

    if (exact.length > 0) {
      pool = exact;
    } else {
      const byLength = toneData.wishes.filter(
        (w) => w.lengthCategory === length && !usedWishIds.has(w.id),
      );
      if (byLength.length > 0) {
        pool = byLength;
      } else {
        const byRel = toneData.wishes.filter(
          (w) => w.relationship === wishRelationship && !usedWishIds.has(w.id),
        );
        if (byRel.length > 0) {
          pool = byRel;
        } else {
          usedWishIds.clear();
          pool = toneData.wishes.filter((w) => w.lengthCategory === length);
          if (pool.length === 0) pool = toneData.wishes;
        }
      }
    }
  }

  if (pool.length === 0) {
    pool = [
      {
        id: 'fallback-1', text: `Happy Birthday, {{name}}! Wishing you a day filled with love, laughter, and all the happiness in the world. May this year bring you closer to all your dreams!`, relationship:'general',
        lengthCategory: 'medium',
      },
    ];
  }

  const shuffled = shuffleArray(pool);
  const selected = shuffled[0];
  usedWishIds.add(selected.id);

  if (usedWishIds.size > 300) {
    const arr = Array.from(usedWishIds);
    arr.slice(0, 100).forEach((id) => usedWishIds.delete(id));
  }

  let finalText = stripEmojis(personalizeWish(selected.text, personName, personalContext));
  finalText = stripEmojis(applyLanguage(finalText, language, personName));

  const wish: GeneratedWish = {
    id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: finalText,
    tone,
    length,
    language,
    personId,
    personName,
    relationship: wishRelationship,
    personalContext: personalContext || '',
    createdAt: new Date().toISOString(),
    isFavorite: false,
    isEdited: false,
    originalText: finalText,
  };

  return wish;
}

export function formatGeneratedWishText(
  text: string,
  options: {
    personName: string;
    personalContext?: string;
    language: WishLanguage;
  },
): string {
  let finalText = stripEmojis(
    personalizeWish(text, options.personName, options.personalContext),
  );
  finalText = stripEmojis(applyLanguage(finalText, options.language, options.personName));
  return finalText;
}
