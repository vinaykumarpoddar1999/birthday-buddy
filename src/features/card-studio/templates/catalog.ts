import type { CardTemplate } from '../types';
import { buildTemplate } from './shared/builders';

export const birthdayTemplate = buildTemplate({
  id: 'tpl-birthday',
  name: 'Birthday Celebration',
  category: 'birthday',
  tags: ['birthday', 'party', 'confetti', 'celebration'],
  background: {
    type: 'gradient',
    value: ['#F472B6', '#A855F7', '#6366F1'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#A855F7', secondary: '#F472B6', text: '#FFFFFF', accent: '#FDE68A' },
  decorations: ['icon:cake', 'icon:gift'],
  headline: 'Happy\nBirthday',
  headlineColor: '#FFFFFF',
  nameColor: '#FDE68A',
  messageColor: '#FCE7F3',
  accentIcons: ['icon:cake', 'icon:gift', 'icon:sparkles'],
});

export const anniversaryTemplate = buildTemplate({
  id: 'tpl-anniversary',
  name: 'Golden Anniversary',
  category: 'anniversary',
  tags: ['anniversary', 'love', 'elegant', 'gold'],
  background: {
    type: 'gradient',
    value: ['#1C1917', '#78350F', '#D97706'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#D97706', secondary: '#FBBF24', text: '#FFFBEB', accent: '#FDE68A' },
  headline: 'Happy\nAnniversary',
  subline: 'Together is a beautiful place',
  headlineColor: '#FDE68A',
  nameColor: '#FFFBEB',
  messageColor: '#FEF3C7',
  accentIcons: ['icon:heart', 'icon:sparkles'],
});

export const loveTemplate = buildTemplate({
  id: 'tpl-love',
  name: 'Romantic Rose',
  category: 'romantic',
  tags: ['love', 'romantic', 'valentine', 'rose'],
  background: {
    type: 'gradient',
    value: ['#FDA4AF', '#F472B6', '#BE185D'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#BE185D', secondary: '#F472B6', text: '#FFFFFF', accent: '#FECDD3' },
  headline: 'With All\nMy Love',
  headlineColor: '#FFFFFF',
  nameColor: '#FECDD3',
  messageColor: '#FFF1F2',
  accentIcons: ['icon:heart', 'icon:flower'],
});

export const friendshipTemplate = buildTemplate({
  id: 'tpl-friendship',
  name: 'Best Friends',
  category: 'friend',
  tags: ['friend', 'friendship', 'fun', 'bff'],
  background: {
    type: 'gradient',
    value: ['#FDE68A', '#FB923C', '#F472B6'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 0 },
  },
  colors: { primary: '#EA580C', secondary: '#F472B6', text: '#7C2D12', accent: '#FEF3C7' },
  headline: 'Hey\nBestie!',
  headlineColor: '#7C2D12',
  nameColor: '#9A3412',
  messageColor: '#78350F',
  accentIcons: ['icon:sparkles', 'icon:gift'],
});

export const congratsTemplate = buildTemplate({
  id: 'tpl-congrats',
  name: 'Congratulations',
  category: 'professional',
  tags: ['congrats', 'achievement', 'success', 'trophy'],
  background: {
    type: 'gradient',
    value: ['#0EA5E9', '#6366F1', '#312E81'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#6366F1', secondary: '#0EA5E9', text: '#FFFFFF', accent: '#A5F3FC' },
  headline: 'Congrats!',
  subline: 'You did it',
  headlineColor: '#FFFFFF',
  nameColor: '#A5F3FC',
  messageColor: '#E0E7FF',
  accentIcons: ['icon:sparkles', 'icon:gift'],
});

export const thankYouTemplate = buildTemplate({
  id: 'tpl-thank-you',
  name: 'Thank You',
  category: 'thank-you',
  tags: ['thank you', 'gratitude', 'appreciation'],
  background: {
    type: 'gradient',
    value: ['#ECFDF5', '#A7F3D0', '#6EE7B7'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#059669', secondary: '#34D399', text: '#064E3B', accent: '#D1FAE5' },
  headline: 'Thank\nYou',
  headlineColor: '#065F46',
  nameColor: '#047857',
  messageColor: '#065F46',
  accentIcons: ['icon:heart', 'icon:flower'],
});

export const festivalTemplate = buildTemplate({
  id: 'tpl-festival',
  name: 'Festival Joy',
  category: 'festival',
  tags: ['festival', 'celebration', 'holiday', 'lights'],
  background: {
    type: 'gradient',
    value: ['#7C3AED', '#DB2777', '#F59E0B'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#7C3AED', secondary: '#F59E0B', text: '#FFFFFF', accent: '#FDE68A' },
  headline: 'Festival\nWishes',
  headlineColor: '#FDE68A',
  nameColor: '#FFFFFF',
  messageColor: '#FCE7F3',
  accentIcons: ['icon:sparkles', 'icon:gift', 'icon:star'],
});

export const motivationTemplate = buildTemplate({
  id: 'tpl-motivation',
  name: 'Stay Inspired',
  category: 'modern',
  tags: ['motivation', 'inspire', 'quote', 'modern'],
  background: {
    type: 'gradient',
    value: ['#111827', '#4C1D95', '#7C3AED'],
    gradientStart: { x: 0, y: 1 },
    gradientEnd: { x: 1, y: 0 },
  },
  colors: { primary: '#7C3AED', secondary: '#A78BFA', text: '#FFFFFF', accent: '#C4B5FD' },
  headline: 'You Got\nThis',
  subline: 'Keep shining',
  headlineColor: '#FFFFFF',
  nameColor: '#C4B5FD',
  messageColor: '#E9D5FF',
  accentIcons: ['icon:sparkles'],
});

export const familyTemplate = buildTemplate({
  id: 'tpl-family',
  name: 'Family Love',
  category: 'family',
  tags: ['family', 'warm', 'home', 'love'],
  background: {
    type: 'gradient',
    value: ['#FEF3C7', '#FDBA74', '#F87171'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#EA580C', secondary: '#F87171', text: '#7C2D12', accent: '#FFEDD5' },
  headline: 'For Our\nFamily',
  headlineColor: '#9A3412',
  nameColor: '#7C2D12',
  messageColor: '#78350F',
  accentIcons: ['icon:heart', 'icon:flower'],
});

export const minimalTemplate = buildTemplate({
  id: 'tpl-minimal',
  name: 'Modern Minimal',
  category: 'minimal',
  tags: ['minimal', 'clean', 'modern', 'simple'],
  background: {
    type: 'gradient',
    value: ['#FFFFFF', '#F3F4F6', '#E5E7EB'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 0, y: 1 },
  },
  colors: { primary: '#111827', secondary: '#6B7280', text: '#111827', accent: '#E5E7EB' },
  headline: 'A Note\nFor You',
  headlineColor: '#111827',
  nameColor: '#374151',
  messageColor: '#4B5563',
  accentIcons: [],
});

export const pastelDreamTemplate = buildTemplate({
  id: 'tpl-pastel-dream',
  name: 'Pastel Dream',
  category: 'birthday',
  tags: ['birthday', 'pastel', 'soft', 'dreamy'],
  background: {
    type: 'gradient',
    value: ['#FBCFE8', '#E9D5FF', '#BFDBFE'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#A855F7', secondary: '#F472B6', text: '#581C87', accent: '#FDF4FF' },
  headline: 'Happy\nBirthday',
  headlineColor: '#7E22CE',
  nameColor: '#6B21A8',
  messageColor: '#581C87',
  accentIcons: ['icon:sparkles', 'icon:flower'],
});

export const neonPartyTemplate = buildTemplate({
  id: 'tpl-neon-party',
  name: 'Neon Party',
  category: 'birthday',
  tags: ['birthday', 'neon', 'party', 'vibrant'],
  background: {
    type: 'gradient',
    value: ['#0F172A', '#7C3AED', '#EC4899'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#EC4899', secondary: '#8B5CF6', text: '#FFFFFF', accent: '#FDE68A' },
  headline: 'Party\nTime!',
  headlineColor: '#FDE68A',
  nameColor: '#FFFFFF',
  messageColor: '#E9D5FF',
  accentIcons: ['icon:sparkles', 'icon:gift'],
});

export const sunsetGlowTemplate = buildTemplate({
  id: 'tpl-sunset-glow',
  name: 'Sunset Glow',
  category: 'anniversary',
  tags: ['anniversary', 'sunset', 'warm', 'romantic'],
  background: {
    type: 'gradient',
    value: ['#F97316', '#EC4899', '#6366F1'],
    gradientStart: { x: 0, y: 1 },
    gradientEnd: { x: 1, y: 0 },
  },
  colors: { primary: '#EA580C', secondary: '#DB2777', text: '#FFFFFF', accent: '#FED7AA' },
  headline: 'Cheers to\nUs',
  subline: 'Another beautiful year',
  headlineColor: '#FFEDD5',
  nameColor: '#FFFFFF',
  messageColor: '#FCE7F3',
  accentIcons: ['icon:heart', 'icon:sparkles'],
});

export const oceanBreezeTemplate = buildTemplate({
  id: 'tpl-ocean-breeze',
  name: 'Ocean Breeze',
  category: 'friend',
  tags: ['friend', 'ocean', 'fresh', 'calm'],
  background: {
    type: 'gradient',
    value: ['#06B6D4', '#3B82F6', '#1E3A8A'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#0284C7', secondary: '#06B6D4', text: '#FFFFFF', accent: '#BAE6FD' },
  headline: 'Hey\nFriend!',
  headlineColor: '#E0F2FE',
  nameColor: '#FFFFFF',
  messageColor: '#BAE6FD',
  accentIcons: ['icon:sparkles'],
});

export const cherryBlossomTemplate = buildTemplate({
  id: 'tpl-cherry-blossom',
  name: 'Cherry Blossom',
  category: 'romantic',
  tags: ['love', 'romantic', 'spring', 'blossom'],
  background: {
    type: 'gradient',
    value: ['#FDF2F8', '#FBCFE8', '#F9A8D4'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#DB2777', secondary: '#F472B6', text: '#831843', accent: '#FCE7F3' },
  headline: 'Thinking\nof You',
  headlineColor: '#9D174D',
  nameColor: '#BE185D',
  messageColor: '#831843',
  accentIcons: ['icon:heart', 'icon:flower'],
});

export const goldenMomentsTemplate = buildTemplate({
  id: 'tpl-golden-moments',
  name: 'Golden Moments',
  category: 'family',
  tags: ['family', 'gold', 'warm', 'celebration'],
  background: {
    type: 'gradient',
    value: ['#78350F', '#D97706', '#FBBF24'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#B45309', secondary: '#F59E0B', text: '#FFFBEB', accent: '#FDE68A' },
  headline: 'Family\nCelebration',
  headlineColor: '#FDE68A',
  nameColor: '#FFFBEB',
  messageColor: '#FEF3C7',
  accentIcons: ['icon:heart', 'icon:gift'],
});

export const starryNightTemplate = buildTemplate({
  id: 'tpl-starry-night',
  name: 'Starry Night',
  category: 'birthday',
  tags: ['birthday', 'stars', 'night', 'magic'],
  background: {
    type: 'gradient',
    value: ['#020617', '#312E81', '#6366F1'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#6366F1', secondary: '#818CF8', text: '#FFFFFF', accent: '#C7D2FE' },
  headline: 'Shine\nBright',
  subline: 'Today is your day',
  headlineColor: '#E0E7FF',
  nameColor: '#FFFFFF',
  messageColor: '#C7D2FE',
  accentIcons: ['icon:star', 'icon:sparkles'],
});

export const gardenFreshTemplate = buildTemplate({
  id: 'tpl-garden-fresh',
  name: 'Garden Fresh',
  category: 'thank-you',
  tags: ['thank you', 'garden', 'nature', 'fresh'],
  background: {
    type: 'gradient',
    value: ['#DCFCE7', '#86EFAC', '#22C55E'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#16A34A', secondary: '#4ADE80', text: '#14532D', accent: '#BBF7D0' },
  headline: 'With\nGratitude',
  headlineColor: '#166534',
  nameColor: '#14532D',
  messageColor: '#15803D',
  accentIcons: ['icon:flower', 'icon:heart'],
});

export const retroPopTemplate = buildTemplate({
  id: 'tpl-retro-pop',
  name: 'Retro Pop',
  category: 'modern',
  tags: ['modern', 'retro', 'pop', 'fun'],
  background: {
    type: 'gradient',
    value: ['#FACC15', '#F97316', '#EF4444'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 0 },
  },
  colors: { primary: '#EA580C', secondary: '#EAB308', text: '#7C2D12', accent: '#FEF9C3' },
  headline: 'Big\nCelebration',
  headlineColor: '#7C2D12',
  nameColor: '#9A3412',
  messageColor: '#78350F',
  accentIcons: ['icon:sparkles', 'icon:gift'],
});

export const elegantScriptTemplate = buildTemplate({
  id: 'tpl-elegant-script',
  name: 'Elegant Script',
  category: 'professional',
  tags: ['professional', 'elegant', 'formal', 'classic'],
  background: {
    type: 'gradient',
    value: ['#1F2937', '#374151', '#6B7280'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 0, y: 1 },
  },
  colors: { primary: '#9CA3AF', secondary: '#D1D5DB', text: '#F9FAFB', accent: '#E5E7EB' },
  headline: 'Warm\nWishes',
  subline: 'With sincere regards',
  headlineColor: '#F3F4F6',
  nameColor: '#FFFFFF',
  messageColor: '#E5E7EB',
  accentIcons: ['icon:sparkles'],
});

export const candyShopTemplate = buildTemplate({
  id: 'tpl-candy-shop',
  name: 'Candy Shop',
  category: 'birthday',
  tags: ['birthday', 'candy', 'sweet', 'kids'],
  background: {
    type: 'gradient',
    value: ['#F472B6', '#C084FC', '#60A5FA'],
    gradientStart: { x: 0, y: 0 },
    gradientEnd: { x: 1, y: 1 },
  },
  colors: { primary: '#EC4899', secondary: '#A855F7', text: '#FFFFFF', accent: '#FBCFE8' },
  headline: 'Sweet\nBirthday',
  headlineColor: '#FFFFFF',
  nameColor: '#FDF2F8',
  messageColor: '#FCE7F3',
  accentIcons: ['icon:cake', 'icon:gift', 'icon:sparkles'],
});

export const ALL_TEMPLATES: CardTemplate[] = [
  birthdayTemplate,
  anniversaryTemplate,
  loveTemplate,
  friendshipTemplate,
  congratsTemplate,
  thankYouTemplate,
  festivalTemplate,
  motivationTemplate,
  familyTemplate,
  minimalTemplate,
  pastelDreamTemplate,
  neonPartyTemplate,
  sunsetGlowTemplate,
  oceanBreezeTemplate,
  cherryBlossomTemplate,
  goldenMomentsTemplate,
  starryNightTemplate,
  gardenFreshTemplate,
  retroPopTemplate,
  elegantScriptTemplate,
  candyShopTemplate,
];
