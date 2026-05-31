import type { DecorationItem } from '../types';

export const DECORATION_ITEMS: DecorationItem[] = [
  { id: 'd-1', emoji: '🎈', label: 'Balloon', category: 'balloons' },
  { id: 'd-2', emoji: '🎈', label: 'Red Balloon', category: 'balloons' },
  { id: 'd-3', emoji: '🫧', label: 'Bubbles', category: 'balloons' },
  { id: 'd-4', emoji: '🎂', label: 'Birthday Cake', category: 'cake' },
  { id: 'd-5', emoji: '🧁', label: 'Cupcake', category: 'cake' },
  { id: 'd-6', emoji: '🎂', label: 'Cake Slice', category: 'cake' },
  { id: 'd-7', emoji: '🕯️', label: 'Candle', category: 'cake' },
  { id: 'd-8', emoji: '🌸', label: 'Cherry Blossom', category: 'flowers' },
  { id: 'd-9', emoji: '🌹', label: 'Rose', category: 'flowers' },
  { id: 'd-10', emoji: '🌺', label: 'Hibiscus', category: 'flowers' },
  { id: 'd-11', emoji: '💐', label: 'Bouquet', category: 'flowers' },
  { id: 'd-12', emoji: '🌷', label: 'Tulip', category: 'flowers' },
  { id: 'd-13', emoji: '🎁', label: 'Gift Box', category: 'gifts' },
  { id: 'd-14', emoji: '🎀', label: 'Ribbon', category: 'gifts' },
  { id: 'd-15', emoji: '💝', label: 'Heart Gift', category: 'gifts' },
  { id: 'd-16', emoji: '🎊', label: 'Confetti Ball', category: 'confetti' },
  { id: 'd-17', emoji: '🎉', label: 'Party Popper', category: 'confetti' },
  { id: 'd-18', emoji: '✨', label: 'Sparkles', category: 'confetti' },
  { id: 'd-19', emoji: '💖', label: 'Heart', category: 'hearts' },
  { id: 'd-20', emoji: '❤️', label: 'Red Heart', category: 'hearts' },
  { id: 'd-21', emoji: '💕', label: 'Two Hearts', category: 'hearts' },
  { id: 'd-22', emoji: '💗', label: 'Growing Heart', category: 'hearts' },
  { id: 'd-23', emoji: '⭐', label: 'Star', category: 'stars' },
  { id: 'd-24', emoji: '🌟', label: 'Glowing Star', category: 'stars' },
  { id: 'd-25', emoji: '💫', label: 'Dizzy Star', category: 'stars' },
  { id: 'd-26', emoji: '🥳', label: 'Party Face', category: 'party' },
  { id: 'd-27', emoji: '🎵', label: 'Music Note', category: 'party' },
  { id: 'd-28', emoji: '🍰', label: 'Shortcake', category: 'party' },
  { id: 'd-29', emoji: '🎪', label: 'Circus Tent', category: 'party' },
  { id: 'd-30', emoji: '🎭', label: 'Masks', category: 'party' },
];

export const CATEGORY_PILLS = [
  { id: 'all', label: 'All Templates', icon: '🎨' },
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'minimal', label: 'Minimal', icon: '✨' },
  { id: 'luxury', label: 'Luxury', icon: '👑' },
  { id: 'cute', label: 'Cute', icon: '🧸' },
  { id: 'funny', label: 'Funny', icon: '😂' },
  { id: 'romantic', label: 'Romantic', icon: '💕' },
  { id: 'photo', label: 'Photo Based', icon: '📷' },
  { id: 'floral', label: 'Floral', icon: '🌸' },
  { id: 'neon', label: 'Neon', icon: '💜' },
  { id: 'anniversary', label: 'Anniversary', icon: '💍' },
  { id: 'kids', label: 'Kids', icon: '🧒' },
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'gradient', label: 'Gradient', icon: '🌈' },
  { id: 'illustration', label: 'Illustration', icon: '🎨' },
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
