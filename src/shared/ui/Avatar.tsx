import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { getAvatarSource, type Gender } from '../utils/avatar';

export type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  gender?: Gender;
};

// Explicit pixel dimensions — same reasoning as ProfilePlaceholder.
const SIZE_PX: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 32,  // h-8
  sm: 40,  // h-10
  md: 48,  // h-12
  lg: 64,  // h-16
  xl: 80,  // h-20
};

const FONT_SIZE: Record<NonNullable<AvatarProps['size']>, number> = {
  xs: 12,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({ uri, name, size = 'md', gender }: AvatarProps) {
  const px = SIZE_PX[size];
  const borderRadius = px / 2;

  const imageSource = uri ? { uri } : gender ? getAvatarSource(gender) : null;

  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={{ width: px, height: px, borderRadius }}
        contentFit="cover"
        accessibilityLabel={name ? `${name} avatar` : 'Avatar'}
      />
    );
  }

  return (
    <View
      style={{
        width: px,
        height: px,
        borderRadius,
        backgroundColor: 'rgba(124,58,237,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{ color: '#7C3AED', fontWeight: '600', fontSize: FONT_SIZE[size] }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
