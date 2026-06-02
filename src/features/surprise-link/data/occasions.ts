import type { LucideIcon } from 'lucide-react-native';
import {
  Baby,
  Cake,
  CalendarHeart,
  GraduationCap,
  Heart,
  HeartHandshake,
  PartyPopper,
  Gem,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Trophy,
} from 'lucide-react-native';

import type { Occasion } from '../types';

export interface OccasionConfig {
  id: Occasion;
  label: string;
  subtitle: string;
  Icon: LucideIcon;
  colors: [string, string];
  accentColor: string;
  emoji: string;
}

export const OCCASIONS: OccasionConfig[] = [
  {
    id: 'birthday',
    label: 'Birthday',
    subtitle: 'Celebrate their special day',
    Icon: Cake,
    colors: ['#FDF2F8', '#FCE7F3'],
    accentColor: '#EC4899',
    emoji: '🎂',
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    subtitle: 'Mark your time together',
    Icon: CalendarHeart,
    colors: ['#FFF1F2', '#FFE4E6'],
    accentColor: '#F43F5E',
    emoji: '💕',
  },
  {
    id: 'valentines',
    label: "Valentine's Day",
    subtitle: 'Share the love',
    Icon: Heart,
    colors: ['#FDF2F8', '#FBCFE8'],
    accentColor: '#DB2777',
    emoji: '❤️',
  },
  {
    id: 'proposal',
    label: 'Proposal',
    subtitle: 'Pop the question beautifully',
    Icon: Gem,
    colors: ['#F5F3FF', '#EDE9FE'],
    accentColor: '#7C3AED',
    emoji: '💍',
  },
  {
    id: 'love_confession',
    label: 'Love Confession',
    subtitle: 'Say what your heart feels',
    Icon: HeartHandshake,
    colors: ['#FFF1F2', '#FECDD3'],
    accentColor: '#E11D48',
    emoji: '💌',
  },
  {
    id: 'miss_you',
    label: 'Miss You',
    subtitle: 'Bridge the distance',
    Icon: Heart,
    colors: ['#EFF6FF', '#DBEAFE'],
    accentColor: '#3B82F6',
    emoji: '🥺',
  },
  {
    id: 'sorry',
    label: 'Sorry',
    subtitle: 'Make amends with heart',
    Icon: HeartHandshake,
    colors: ['#F0FDF4', '#DCFCE7'],
    accentColor: '#16A34A',
    emoji: '🙏',
  },
  {
    id: 'graduation',
    label: 'Graduation',
    subtitle: 'Celebrate their achievement',
    Icon: GraduationCap,
    colors: ['#FFFBEB', '#FEF3C7'],
    accentColor: '#D97706',
    emoji: '🎓',
  },
  {
    id: 'congratulations',
    label: 'Congratulations',
    subtitle: 'Cheer their success',
    Icon: Trophy,
    colors: ['#FEFCE8', '#FEF08A'],
    accentColor: '#CA8A04',
    emoji: '🏆',
  },
  {
    id: 'baby_shower',
    label: 'Baby Shower',
    subtitle: 'Welcome the little one',
    Icon: Baby,
    colors: ['#F0F9FF', '#E0F2FE'],
    accentColor: '#0284C7',
    emoji: '👶',
  },
  {
    id: 'wedding',
    label: 'Wedding',
    subtitle: 'Honor their union',
    Icon: Gem,
    colors: ['#FAF5FF', '#F3E8FF'],
    accentColor: '#9333EA',
    emoji: '💒',
  },
  {
    id: 'christmas',
    label: 'Christmas',
    subtitle: 'Spread holiday joy',
    Icon: Snowflake,
    colors: ['#F0FDF4', '#BBF7D0'],
    accentColor: '#15803D',
    emoji: '🎄',
  },
  {
    id: 'new_year',
    label: 'New Year',
    subtitle: 'Ring in new beginnings',
    Icon: Sparkles,
    colors: ['#EEF2FF', '#C7D2FE'],
    accentColor: '#4F46E5',
    emoji: '🎆',
  },
  {
    id: 'custom',
    label: 'Custom Occasion',
    subtitle: 'Create your own moment',
    Icon: Star,
    colors: ['#F8FAFC', '#E2E8F0'],
    accentColor: '#64748B',
    emoji: '✨',
  },
];

export function getOccasionConfig(id: Occasion): OccasionConfig {
  return OCCASIONS.find((o) => o.id === id) ?? OCCASIONS[0];
}
