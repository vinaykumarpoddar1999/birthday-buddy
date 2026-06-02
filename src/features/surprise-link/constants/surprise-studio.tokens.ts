/** Design tokens for Surprise Link Studio — single source for flow-wide consistency. */
export const SURPRISE_STUDIO = {
  gradient: {
    screen: ['#FAFAFF', '#F5F3FF', '#FFFFFF'] as const,
    cta: ['#7C3AED', '#EC4899'] as const,
    ctaExtended: ['#7C3AED', '#9333EA', '#EC4899'] as const,
    intro: ['#F5F3FF', '#EDE9FE', '#FFF1F2'] as const,
  },
  color: {
    primary: '#7C3AED',
    secondary: '#EC4899',
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    ink: '#111827',
    muted: '#6B7280',
    border: '#F3F4F6',
    footerBg: '#F8F6FC',
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  touch: {
    min: 44,
  },
} as const;
