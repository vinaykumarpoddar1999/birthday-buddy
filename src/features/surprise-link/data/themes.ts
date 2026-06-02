import type { ExperienceTheme, ThemeId, VisualEffect } from '../types';

export const THEMES: Record<ThemeId, ExperienceTheme> = {
  luxury_gold: {
    id: 'luxury_gold',
    primaryColor: '#D4AF37',
    secondaryColor: '#B8860B',
    backgroundColor: '#1A1A2E',
    textColor: '#FFF8E7',
    accentColor: '#FFD700',
  },
  romantic_pink: {
    id: 'romantic_pink',
    primaryColor: '#EC4899',
    secondaryColor: '#F472B6',
    backgroundColor: '#FFF1F2',
    textColor: '#881337',
    accentColor: '#FB7185',
  },
  dark_elegant: {
    id: 'dark_elegant',
    primaryColor: '#6366F1',
    secondaryColor: '#818CF8',
    backgroundColor: '#0F172A',
    textColor: '#F1F5F9',
    accentColor: '#A5B4FC',
  },
  neon: {
    id: 'neon',
    primaryColor: '#22D3EE',
    secondaryColor: '#A855F7',
    backgroundColor: '#0C0A1D',
    textColor: '#F0FDFF',
    accentColor: '#F472B6',
  },
  royal: {
    id: 'royal',
    primaryColor: '#7C3AED',
    secondaryColor: '#5B21B6',
    backgroundColor: '#1E1B4B',
    textColor: '#EDE9FE',
    accentColor: '#C4B5FD',
  },
  galaxy: {
    id: 'galaxy',
    primaryColor: '#818CF8',
    secondaryColor: '#6366F1',
    backgroundColor: '#030712',
    textColor: '#E0E7FF',
    accentColor: '#C084FC',
  },
  floral: {
    id: 'floral',
    primaryColor: '#F472B6',
    secondaryColor: '#FB923C',
    backgroundColor: '#FFFBEB',
    textColor: '#78350F',
    accentColor: '#FBBF24',
  },
  cute: {
    id: 'cute',
    primaryColor: '#F472B6',
    secondaryColor: '#A78BFA',
    backgroundColor: '#FDF4FF',
    textColor: '#701A75',
    accentColor: '#E879F9',
  },
  minimal: {
    id: 'minimal',
    primaryColor: '#374151',
    secondaryColor: '#6B7280',
    backgroundColor: '#FFFFFF',
    textColor: '#111827',
    accentColor: '#9CA3AF',
  },
  modern: {
    id: 'modern',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0284C7',
    backgroundColor: '#F8FAFC',
    textColor: '#0F172A',
    accentColor: '#38BDF8',
  },
  glassmorphism: {
    id: 'glassmorphism',
    primaryColor: '#7C3AED',
    secondaryColor: '#EC4899',
    backgroundColor: '#F5F3FF',
    textColor: '#1E1B4B',
    accentColor: '#C4B5FD',
  },
  birthday_celebration: {
    id: 'birthday_celebration',
    primaryColor: '#7C3AED',
    secondaryColor: '#EC4899',
    backgroundColor: '#FDF4FF',
    textColor: '#4C1D95',
    accentColor: '#FBBF24',
  },
};

export const VISUAL_EFFECTS: { id: VisualEffect; label: string; emoji: string }[] = [
  { id: 'confetti', label: 'Confetti', emoji: '🎊' },
  { id: 'fireworks', label: 'Fireworks', emoji: '🎆' },
  { id: 'hearts', label: 'Hearts', emoji: '💕' },
  { id: 'flowers', label: 'Flowers', emoji: '🌸' },
  { id: 'snow', label: 'Snow', emoji: '❄️' },
  { id: 'sparkles', label: 'Sparkles', emoji: '✨' },
  { id: 'balloons', label: 'Balloons', emoji: '🎈' },
  { id: 'particles', label: 'Particles', emoji: '💫' },
  { id: 'glow', label: 'Glow', emoji: '🌟' },
  { id: 'floating_objects', label: 'Floating', emoji: '🎀' },
];

export function getTheme(id: ThemeId): ExperienceTheme {
  return THEMES[id] ?? THEMES.birthday_celebration;
}
