import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, type ViewStyle } from 'react-native';

import { getAvatarGradient, getInitials } from '@/shared/utils/initial-avatar';

export type InitialAvatarSize = 'tiny' | 'xs' | 'sm' | 'header' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<InitialAvatarSize, number> = {
  tiny: 24,
  xs: 32,
  sm: 44,
  header: 48,
  md: 56,
  lg: 80,
  xl: 112,
};

const FONT_SIZE: Record<InitialAvatarSize, number> = {
  tiny: 9,
  xs: 11,
  sm: 14,
  header: 15,
  md: 18,
  lg: 24,
  xl: 32,
};

export type InitialAvatarProps = {
  name?: string | null;
  size?: InitialAvatarSize;
  /** Overrides preset size (square px). */
  dimension?: number;
  borderClassName?: string;
  className?: string;
  style?: ViewStyle;
};

export function InitialAvatar({
  name,
  size = 'md',
  dimension,
  borderClassName = '',
  className = '',
  style,
}: InitialAvatarProps) {
  const px = dimension ?? SIZE_PX[size];
  const fontSize = dimension
    ? Math.max(10, Math.round(dimension * 0.32))
    : FONT_SIZE[size];
  const borderRadius = px / 2;
  const initials = getInitials(name);
  const gradient = getAvatarGradient(name);

  return (
    <View
      className={`overflow-hidden ${borderClassName} ${className}`.trim() || undefined}
      style={[
        {
          width: px,
          height: px,
          borderRadius,
          shadowColor: gradient[0],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: px,
          height: px,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize,
            letterSpacing: 0.5,
          }}
          accessibilityLabel={name ? `${name} avatar` : 'Avatar'}>
          {initials}
        </Text>
      </LinearGradient>
    </View>
  );
}
