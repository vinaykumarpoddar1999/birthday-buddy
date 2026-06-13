import birthdayWishesData from '../../../assets/data/birthday-wishes.json';

export type BirthdayWishCategory =
  | 'Friend'
  | 'Best Friend'
  | 'Brother'
  | 'Sister'
  | 'Mother'
  | 'Father'
  | 'Wife'
  | 'Husband'
  | 'Girlfriend'
  | 'Boyfriend'
  | 'Colleague'
  | 'Boss'
  | 'Client'
  | 'Teacher';

type BirthdayWishesData = Record<BirthdayWishCategory, string[]>;

const WISHES_BY_CATEGORY = birthdayWishesData as BirthdayWishesData;

const CATEGORIES = Object.keys(WISHES_BY_CATEGORY) as BirthdayWishCategory[];

const CATEGORY_ALIASES: Record<string, BirthdayWishCategory> = {
  friend: 'Friend',
  'best friend': 'Best Friend',
  bestfriend: 'Best Friend',
  brother: 'Brother',
  sister: 'Sister',
  mother: 'Mother',
  mom: 'Mother',
  father: 'Father',
  dad: 'Father',
  wife: 'Wife',
  husband: 'Husband',
  girlfriend: 'Girlfriend',
  boyfriend: 'Boyfriend',
  colleague: 'Colleague',
  coworker: 'Colleague',
  boss: 'Boss',
  manager: 'Boss',
  client: 'Client',
  customer: 'Client',
  teacher: 'Teacher',
  professor: 'Teacher',
  mentor: 'Teacher',
};

const APP_RELATIONSHIP_POOLS: Record<string, BirthdayWishCategory[]> = {
  friend: ['Friend', 'Best Friend'],
  family: ['Brother', 'Sister', 'Mother', 'Father'],
  partner: ['Wife', 'Husband', 'Girlfriend', 'Boyfriend'],
  colleague: ['Colleague', 'Boss'],
  relative: ['Brother', 'Sister', 'Mother', 'Father', 'Friend'],
  girlfriend: ['Girlfriend'],
  boyfriend: ['Boyfriend'],
  other: ['Friend', 'Best Friend'],
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export class BirthdayWishService {
  private readonly wishesByCategory: BirthdayWishesData;

  constructor(data: BirthdayWishesData = WISHES_BY_CATEGORY) {
    this.wishesByCategory = data;
  }

  get categories(): BirthdayWishCategory[] {
    return CATEGORIES.filter((category) => this.wishesByCategory[category]?.length > 0);
  }

  getRandomWish(relationship?: string, name?: string): string {
    const category = relationship
      ? this.resolveCategory(relationship)
      : pickRandom(this.categories);
    return this.pickWishForCategory(category, name);
  }

  getWishByRelationship(relationship: string, name?: string): string {
    return this.pickWishForCategory(this.resolveCategory(relationship), name);
  }

  getMultipleWishes(relationship: string, count: number, name?: string): string[] {
    const category = this.resolveCategory(relationship);
    const pool = this.wishesByCategory[category] ?? this.wishesByCategory.Friend;
    const limit = Math.max(1, Math.min(count, pool.length));
    return shuffle(pool)
      .slice(0, limit)
      .map((wish) => this.applyName(wish, name));
  }

  private resolveCategory(relationship: string): BirthdayWishCategory {
    const normalized = relationship.trim().toLowerCase();

    const alias = CATEGORY_ALIASES[normalized];
    if (alias) return alias;

    const direct = this.categories.find(
      (category) => category.toLowerCase() === normalized,
    );
    if (direct) return direct;

    const pool = APP_RELATIONSHIP_POOLS[normalized];
    if (pool?.length) return pickRandom(pool);

    return 'Friend';
  }

  private pickWishForCategory(category: BirthdayWishCategory, name?: string): string {
    const pool = this.wishesByCategory[category] ?? this.wishesByCategory.Friend;
    return this.applyName(pickRandom(pool), name);
  }

  private applyName(text: string, name?: string): string {
    return text.replace(/\{\{name\}\}/g, name?.trim() || 'Friend');
  }
}

export const birthdayWishService = new BirthdayWishService();
