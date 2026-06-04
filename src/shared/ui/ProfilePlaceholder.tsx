import { InitialAvatar } from '@/shared/ui/InitialAvatar';
import { ProfileAvatar } from '@/shared/ui/ProfileAvatar';
import { Cake, Users, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

export type ProfilePlaceholderSize =
  | 'tiny'
  | 'xs'
  | 'sm'
  | 'header'
  | 'md'
  | 'lg'
  | 'xl';

export type ProfilePlaceholderVariant = 'user' | 'female' | 'group' | 'cake';

const ICON_SIZE: Record<ProfilePlaceholderSize, number> = {
  tiny: 11,
  xs: 14,
  sm: 18,
  header: 20,
  md: 22,
  lg: 28,
  xl: 36,
};

const ICON_BG: Record<'group' | 'cake', string> = {
  group: 'rgba(255,255,255,0.25)',
  cake: '#fce7f3',
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
  name?: string | null;
  gender?: 'male' | 'female' | 'other';
  /** @deprecated Use `name` for initials; kept for accessibility only */
  label?: string;
  borderClassName?: string;
  className?: string;
};

export function ProfilePlaceholder({
  size = 'md',
  variant = 'user',
  name,
  gender,
  label,
  borderClassName = '',
  className = '',
}: ProfilePlaceholderProps) {
  if (variant === 'user' || variant === 'female') {
    const resolvedGender = gender ?? (variant === 'female' ? 'female' : undefined);
    return (
      <ProfileAvatar
        size={size}
        name={name ?? label}
        gender={resolvedGender}
        borderClassName={borderClassName}
        className={className}
        label={label ?? undefined}
      />
    );
  }

  const SIZE_PX: Record<ProfilePlaceholderSize, number> = {
    tiny: 24,
    xs: 32,
    sm: 44,
    header: 48,
    md: 56,
    lg: 80,
    xl: 112,
  };
  const px = SIZE_PX[size];
  const borderRadius = px / 2;
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
