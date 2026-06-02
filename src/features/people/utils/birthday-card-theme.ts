import { scale } from '@features/home/constants/design-tokens';

export type BirthdayCardTheme = {
  gradient: [string, string];
  accent: string;
  bgLight: string;
};

export const BIRTHDAY_CARD_THEMES: BirthdayCardTheme[] = [
  { gradient: ['#F3E8FF', '#EDE9FE'], accent: '#8B5CF6', bgLight: '#F5F3FF' },
  { gradient: ['#FCE7F3', '#FDF2F8'], accent: '#EC4899', bgLight: '#FDF2F8' },
  { gradient: ['#DBEAFE', '#EFF6FF'], accent: '#3B82F6', bgLight: '#EFF6FF' },
  { gradient: ['#D1FAE5', '#ECFDF5'], accent: '#10B981', bgLight: '#ECFDF5' },
  { gradient: ['#FEF3C7', '#FFFBEB'], accent: '#F59E0B', bgLight: '#FFFBEB' },
];

export function getBirthdayCardTheme(index: number): BirthdayCardTheme {
  return BIRTHDAY_CARD_THEMES[index % BIRTHDAY_CARD_THEMES.length]!;
}

export function getThemeIndexForRelationship(relationship: string): number {
  const map: Record<string, number> = {
    friend: 0,
    family: 1,
    partner: 2,
    colleague: 3,
    relative: 4,
  };
  return map[relationship] ?? 0;
}

export const birthdayCardStyles = {
  card: {
    marginBottom: scale(14),
    borderRadius: scale(22),
    overflow: 'hidden' as const,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cardGradient: {
    padding: scale(14),
  },
  cardRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  avatarGlow: {
    width: scale(68),
    height: scale(68),
    borderRadius: scale(34),
    borderWidth: 2.5,
    overflow: 'hidden' as const,
  },
  avatarImage: {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius: scale(34),
  },
  centerContent: {
    flex: 1,
    paddingRight: scale(8),
  },
  daysPanel: {
    width: scale(72),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: scale(12),
    borderRadius: scale(16),
  },
  daysNumber: {
    fontSize: scale(24),
    fontWeight: '800' as const,
    marginTop: scale(4),
  },
  daysLabel: {
    fontSize: scale(9),
    fontWeight: '600' as const,
    marginTop: scale(2),
  },
  quickBtn: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    backgroundColor: '#FFFFFF',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
