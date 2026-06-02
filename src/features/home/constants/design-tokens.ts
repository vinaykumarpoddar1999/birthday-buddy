import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 390;

export const scale = (size: number): number =>
  Math.round((size * SCREEN_WIDTH) / BASE_WIDTH);

export const Colors = {
  background: '#F8F6FC',
  surface: '#FFFFFF',
  foreground: '#0F172A',
  foregroundSecondary: '#64748B',
  foregroundMuted: '#94A3B8',
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  purple: '#8B5CF6',
  purpleDeep: '#6A11FF',
  pink: '#C026D3',
  pinkHot: '#FF4D9D',
  pinkBadge: '#FF2D7A',
  orange: '#FFA64D',
  orangeDark: '#FF7A59',
  indigo: '#4F46E5',
  gold: '#FCD34D',
  border: '#E2E8F0',
} as const;

export const Gradients = {
  hero: ['#6A11FF', '#8B5CF6', '#C026D3', '#FF4D9D'] as const,
  statsOrange: ['#FFA64D', '#FF7A59'] as const,
  statsPurple: ['#4F46E5', '#9333EA'] as const,
  fab: ['#7C3AED', '#A855F7'] as const,
  promoBanner: ['#FCE7F3', '#F5F3FF', '#EDE9FE'] as const,
} as const;

export const Spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  screenPadding: scale(20),
  sectionGap: scale(24),
  cardPadding: scale(16),
} as const;

export const Radius = {
  sm: scale(12),
  md: scale(16),
  lg: scale(20),
  xl: scale(24),
  xxl: scale(28),
  xxxl: scale(32),
  full: 9999,
} as const;

export const Typography = {
  heroName: {
    fontSize: scale(32),
    fontWeight: '800' as const,
    color: Colors.foreground,
    fontFamily: Platform.select({ ios: 'Inter-ExtraBold', android: 'Inter_800ExtraBold', default: 'System' }),
  },
  sectionTitle: {
    fontSize: scale(22),
    fontWeight: '800' as const,
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: scale(15),
    fontWeight: '500' as const,
    color: Colors.foregroundSecondary,
  },
  cardName: {
    fontSize: scale(18),
    fontWeight: '800' as const,
    color: Colors.foreground,
  },
  body: {
    fontSize: scale(14),
    fontWeight: '500' as const,
    color: Colors.foregroundSecondary,
  },
  caption: {
    fontSize: scale(12),
    fontWeight: '600' as const,
    color: Colors.foregroundMuted,
  },
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 6,
  },
  hero: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 12,
  },
  button: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 4,
  },
  fab: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 14,
  },
  tabBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 16,
  },
} as const;
