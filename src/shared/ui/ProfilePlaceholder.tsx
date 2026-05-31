import { Image } from 'expo-image';
import { View } from 'react-native';
import { Cake, Users, type LucideIcon } from 'lucide-react-native';

import { getAvatarSource } from '../utils/avatar';

export type ProfilePlaceholderSize =
  | 'tiny'
  | 'xs'
  | 'sm'
  | 'header'
  | 'md'
  | 'lg'
  | 'xl';

export type ProfilePlaceholderVariant = 'user' | 'female' | 'group' | 'cake';

// ─── Explicit pixel dimensions (NativeWind dynamic class strings are not
//     statically analysable by the Babel transform, so width/height/radius
//     MUST come from explicit style props, not template-interpolated classes). ──

const SIZE_PX: Record<ProfilePlaceholderSize, number> = {
  tiny: 24,   // h-6
  xs: 32,     // h-8
  sm: 44,     // h-11
  header: 48, // h-12
  md: 56,     // h-14
  lg: 80,     // h-20
  xl: 112,    // h-28
};

const ICON_SIZE: Record<ProfilePlaceholderSize, number> = {
  tiny: 11,
  xs: 14,
  sm: 18,
  header: 20,
  md: 22,
  lg: 28,
  xl: 36,
};

// Background colors for icon-only variants (no NativeWind dynamic class needed)
const ICON_BG: Record<'group' | 'cake', string> = {
  group: 'rgba(255,255,255,0.25)', // bg-white/25
  cake: '#fce7f3',                 // bg-pink-100
};

const ICON_COLOR: Record<'group' | 'cake', string> = {
  group: '#FFFFFF',
  cake: '#EC4899',
};

type IconConfig = { Icon: LucideIcon };

const ICON_CONFIG: Record<'group' | 'cake', IconConfig> = {
  group: { Icon: Users },
  cake: { Icon: Cake },
};

export type ProfilePlaceholderProps = {
  size?: ProfilePlaceholderSize;
  variant?: ProfilePlaceholderVariant;
  label?: string;
  /** Static border classes e.g. "border-2 border-white" — kept as className
   *  because callers always pass literal strings (statically extractable). */
  borderClassName?: string;
  className?: string;
};

export function ProfilePlaceholder({
  size = 'md',
  variant = 'user',
  label,
  borderClassName = '',
  className = '',
}: ProfilePlaceholderProps) {
  const px = SIZE_PX[size];
  const borderRadius = px / 2;

  // ── Image avatar (boy.png / girl.png) ─────────────────────────────────────
  if (variant === 'user' || variant === 'female') {
    const source = getAvatarSource(variant === 'female' ? 'female' : 'male');
    return (
      <Image
        source={source}
        // width + height + radius come from explicit style — NOT className —
        // so that they are always applied regardless of NativeWind extraction.
        style={{ width: px, height: px, borderRadius }}
        // borderClassName / className are static strings at call sites → OK.
        className={`${borderClassName} ${className}`.trim() || undefined}
        contentFit="cover"
        accessibilityLabel={
          label ?? (variant === 'female' ? 'Female profile photo' : 'Male profile photo')
        }
      />
    );
  }

  // ── Icon avatar (group / cake) ─────────────────────────────────────────────
  const { Icon } = ICON_CONFIG[variant];
  return (
    <View
      style={{
        width: px,
        height: px,
        borderRadius,
        backgroundColor: ICON_BG[variant],
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={`${borderClassName} ${className}`.trim() || undefined}
      accessibilityLabel={label ?? 'Profile placeholder'}>
      <Icon size={ICON_SIZE[size]} color={ICON_COLOR[variant]} strokeWidth={2} />
    </View>
  );
}
