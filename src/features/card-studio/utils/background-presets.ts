import type { CardBackground } from '../types';

export const SOLID_COLOR_PRESETS = [
  '#FFFFFF', '#FCE7F3', '#EDE9FE', '#DBEAFE', '#D1FAE5',
  '#FEF3C7', '#FEE2E2', '#1F2937', '#7C3AED', '#EC4899',
  '#0EA5E9', '#F59E0B', '#10B981', '#111827', '#F472B6',
];

export const GRADIENT_PRESETS: (CardBackground & { name: string })[] = [
  {
    name: 'Purple Sunset',
    type: 'gradient',
    value: ['#8B5CF6', '#EC4899', '#F97316'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  {
    name: 'Birthday Glow',
    type: 'gradient',
    value: ['#F472B6', '#A855F7', '#6366F1'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 0 },
  },
  {
    name: 'Golden Luxury',
    type: 'gradient',
    value: ['#F59E0B', '#D97706', '#92400E'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 0, y: 1 },
  },
  {
    name: 'Pink Celebration',
    type: 'gradient',
    value: ['#FCE7F3', '#F472B6', '#EC4899'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  {
    name: 'Ocean Blue',
    type: 'gradient',
    value: ['#0EA5E9', '#6366F1', '#312E81'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 1 },
    gradientEnd: { x: 1, y: 0 },
  },
  {
    name: 'Neon Party',
    type: 'gradient',
    value: ['#06B6D4', '#8B5CF6', '#EC4899'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  {
    name: 'Romantic Rose',
    type: 'gradient',
    value: ['#FDA4AF', '#F472B6', '#BE185D'],
    gradientType: 'radial',
    gradientStart: { x: 0.5, y: 0.5 },
    gradientEnd: { x: 1, y: 1 },
  },
  {
    name: 'Midnight',
    type: 'gradient',
    value: ['#1F2937', '#4C1D95', '#7C3AED'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  {
    name: 'Emerald Dawn',
    type: 'gradient',
    value: ['#064E3B', '#059669', '#6EE7B7'],
    gradientType: 'linear',
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
];

export const TEXT_COLORS = [
  '#FFFFFF', '#111827', '#7C3AED', '#EC4899', '#0EA5E9',
  '#F59E0B', '#10B981', '#BE185D', '#FDE68A', '#1F2937',
];

export const EMOJI_PRESETS = [
  '🎉', '🎂', '🎈', '🎁', '💖', '✨', '🌟', '💐', '🥳', '😊',
  '❤️', '💕', '🙏', '👏', '🌸', '🦋', '🌈', '☀️', '🎊', '💫',
];
