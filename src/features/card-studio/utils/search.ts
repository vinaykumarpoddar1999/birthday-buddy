import type { DecorationItem } from '../types';

export const DECORATION_ITEMS: DecorationItem[] = [
  { id: 'd-1', iconKey: 'balloon', label: 'Balloon', category: 'balloons' },
  { id: 'd-2', iconKey: 'balloon', label: 'Red Balloon', category: 'balloons' },
  { id: 'd-3', iconKey: 'sparkles', label: 'Bubbles', category: 'balloons' },
  { id: 'd-4', iconKey: 'cake', label: 'Birthday Cake', category: 'cake' },
  { id: 'd-5', iconKey: 'cake', label: 'Cupcake', category: 'cake' },
  { id: 'd-6', iconKey: 'cake', label: 'Cake Slice', category: 'cake' },
  { id: 'd-7', iconKey: 'sparkles', label: 'Candle', category: 'cake' },
  { id: 'd-8', iconKey: 'flower', label: 'Cherry Blossom', category: 'flowers' },
  { id: 'd-9', iconKey: 'flower2', label: 'Rose', category: 'flowers' },
  { id: 'd-10', iconKey: 'flower', label: 'Hibiscus', category: 'flowers' },
  { id: 'd-11', iconKey: 'flower2', label: 'Bouquet', category: 'flowers' },
  { id: 'd-12', iconKey: 'flower2', label: 'Tulip', category: 'flowers' },
  { id: 'd-13', iconKey: 'gift', label: 'Gift Box', category: 'gifts' },
  { id: 'd-14', iconKey: 'gift', label: 'Ribbon', category: 'gifts' },
  { id: 'd-15', iconKey: 'gift', label: 'Heart Gift', category: 'gifts' },
  { id: 'd-16', iconKey: 'party-popper', label: 'Confetti Ball', category: 'confetti' },
  { id: 'd-17', iconKey: 'party-popper', label: 'Party Popper', category: 'confetti' },
  { id: 'd-18', iconKey: 'sparkles', label: 'Sparkles', category: 'confetti' },
  { id: 'd-19', iconKey: 'heart', label: 'Heart', category: 'hearts' },
  { id: 'd-20', iconKey: 'heart', label: 'Red Heart', category: 'hearts' },
  { id: 'd-21', iconKey: 'heart', label: 'Two Hearts', category: 'hearts' },
  { id: 'd-22', iconKey: 'heart', label: 'Growing Heart', category: 'hearts' },
  { id: 'd-23', iconKey: 'star', label: 'Star', category: 'stars' },
  { id: 'd-24', iconKey: 'star', label: 'Glowing Star', category: 'stars' },
  { id: 'd-25', iconKey: 'sparkles', label: 'Dizzy Star', category: 'stars' },
  { id: 'd-26', iconKey: 'party-popper', label: 'Party Face', category: 'party' },
  { id: 'd-27', iconKey: 'music', label: 'Music Note', category: 'party' },
  { id: 'd-28', iconKey: 'cake', label: 'Shortcake', category: 'party' },
  { id: 'd-29', iconKey: 'party-popper', label: 'Circus Tent', category: 'party' },
  { id: 'd-30', iconKey: 'sparkles', label: 'Masks', category: 'party' },
];

export const CATEGORY_PILLS = [
  { id: 'all', label: 'All Templates', iconKey: 'sparkles' },
  { id: 'trending', label: 'Trending', iconKey: 'zap' },
  { id: 'minimal', label: 'Minimal', iconKey: 'circle' },
  { id: 'luxury', label: 'Luxury', iconKey: 'crown' },
  { id: 'cute', label: 'Cute', iconKey: 'baby' },
  { id: 'funny', label: 'Funny', iconKey: 'laugh' },
  { id: 'romantic', label: 'Romantic', iconKey: 'heart' },
  { id: 'photo', label: 'Photo Based', iconKey: 'camera' },
  { id: 'floral', label: 'Floral', iconKey: 'flower2' },
  { id: 'neon', label: 'Neon', iconKey: 'heart' },
  { id: 'anniversary', label: 'Anniversary', iconKey: 'gem' },
  { id: 'kids', label: 'Kids', iconKey: 'baby' },
  { id: 'professional', label: 'Professional', iconKey: 'briefcase' },
  { id: 'gradient', label: 'Gradient', iconKey: 'rainbow' },
  { id: 'illustration', label: 'Illustration', iconKey: 'palette' },
] as const;

export const OCCASION_FILTERS = [
  'Birthday',
  'Anniversary',
  'Wedding Anniversary',
  'Other Events',
] as const;

export const STYLE_FILTERS = [
  'All Styles',
  'Photo Based',
  'Illustration',
  'Gradient',
  'Minimal',
] as const;
