import { designTokens } from '@/constants/design';

export const studioTokens = {
  colors: {
    primary: designTokens.colors.primary,
    primaryDark: designTokens.colors.primaryDark,
    background: designTokens.colors.background,
    surface: designTokens.colors.surface,
    textPrimary: designTokens.colors.textPrimary,
    textSecondary: designTokens.colors.textSecondary,
    textMuted: designTokens.colors.textMuted,
    border: designTokens.colors.border,
    success: designTokens.colors.success,
    frameTint: '#F3F0FF',
    gradientPrimary: ['#7C3AED', '#5B21B6'] as const,
    gradientProgress: ['#7C3AED', '#A855F7'] as const,
    gradientDone: ['#22C55E', '#16A34A'] as const,
  },
  radius: designTokens.radius,
  spacing: designTokens.spacing,
  touchMin: 44,
  searchHeight: 36,
  tabHeight: 48,
  tabSegmentHeight: 48,
  editorPanelPadding: 12,
  templateCardRadius: 16,
  swatchSize: 44,
} as const;
