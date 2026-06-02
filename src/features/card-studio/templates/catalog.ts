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
];
