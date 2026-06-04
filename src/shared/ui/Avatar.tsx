import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { getInitials, getAvatarGradient } from '@/shared/utils/initial-avatar';
import { LinearGradient } from 'expo-linear-gradient';

import type { Gender } from '../utils/avatar';
import { getAvatarSource } from '../utils/avatar';

export type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  gender?: Gender;
};

const SIZE_PX: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
};

const FONT_SIZE: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 12,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
};

export function Avatar({ uri, name, size = 'md', gender }: AvatarProps) {
  const px = SIZE_PX[size];
  const borderRadius = px / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: px, height: px, borderRadius }}
        contentFit="cover"
        accessibilityLabel={name ? `${name} avatar` : 'Avatar'}
      />
    );
  }

  if (gender && !name) {
    return (
      <Image
        source={getAvatarSource(gender)}
        style={{ width: px, height: px, borderRadius }}
        contentFit="cover"
        accessibilityLabel={name ? `${name} avatar` : 'Avatar'}
      />
    );
  }

  const gradient = getAvatarGradient(name);
  const initials = getInitials(name);

  return (
    <View
      style={{
        width: px,
        height: px,
        borderRadius,
        shadowColor: gradient[0],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
      }}>
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
          style={{ color: '#FFFFFF', fontWeight: '700', fontSize: FONT_SIZE[size] }}>
          {initials}
        </Text>
      </LinearGradient>
    </View>
  );
}
