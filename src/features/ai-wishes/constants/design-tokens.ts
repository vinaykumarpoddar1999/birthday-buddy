import type { ViewStyle } from 'react-native';

export const WishColors = {
  primary: '#7C3AED',
  primaryDark: '#5B21B6',
  primaryLight: '#EDE9FE',
  secondary: '#EC4899',
  accent: '#F59E0B',
  success: '#22C55E',
  error: '#EF4444',
  white: '#FFFFFF',
  background: '#F8F6FC',
  surface: '#FFFFFF',
  foreground: '#111827',
  foregroundSecondary: '#6B7280',
  foregroundMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
} as const;

export const WishGradients = {
  header: ['#7C3AED', '#9333EA', '#EC4899'] as const,
  primary: ['#7C3AED', '#9333EA', '#EC4899'] as const,
  card: ['#F5F3FF', '#FFFFFF'] as const,
  celebration: ['#EDE9FE', '#FCE7F3'] as const,
} as const;

export const WishSpacing = {
  screen: 20,
  section: 24,
  card: 16,
  item: 12,
  tight: 8,
} as const;

export const WishRadius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
} as const;

export const WishTypography = {
  hero: { fontSize: 20, fontWeight: '900' as const, letterSpacing: -0.4 },
  title: { fontSize: 16, fontWeight: '800' as const, letterSpacing: -0.2 },
  subtitle: { fontSize: 12, fontWeight: '500' as const },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 11, fontWeight: '600' as const },
  micro: { fontSize: 10, fontWeight: '700' as const },
} as const;

export const WishShadows = {
  sm: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  } satisfies ViewStyle,
  md: {
    shadowColor: WishColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  } satisfies ViewStyle,
  lg: {
    shadowColor: WishColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  } satisfies ViewStyle,
  glow: {
    shadowColor: WishColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  } satisfies ViewStyle,
} as const;

export const WishIconSizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28,
} as const;
