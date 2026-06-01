import { Image } from 'expo-image';
import { View } from 'react-native';

import { getAvatarSource } from '@/shared/utils/avatar';
import type { ProfilePlaceholderSize } from '@shared/ui/ProfilePlaceholder';

const SIZE_PX: Record<ProfilePlaceholderSize, number> = {
  tiny: 24,
  xs: 32,
  sm: 44,
  header: 48,
  md: 56,
  lg: 80,
  xl: 112,
};

export type ProfileAvatarProps = {
  size?: ProfilePlaceholderSize;
  profileImage?: string | null;
  gender?: 'male' | 'female' | 'other';
  borderClassName?: string;
  className?: string;
  label?: string;
};

export function ProfileAvatar({
  size = 'md',
  profileImage,
  gender = 'other',
  borderClassName = '',
  className = '',
  label,
}: ProfileAvatarProps) {
  const px = SIZE_PX[size];
  const borderRadius = px / 2;
  const source = profileImage
    ? { uri: profileImage }
    : getAvatarSource(gender === 'female' ? 'female' : 'male');

  return (
    <View
      className={`overflow-hidden ${borderClassName} ${className}`.trim() || undefined}
      style={{ width: px, height: px, borderRadius }}>
      <Image
        source={source}
        style={{ width: px, height: px, borderRadius }}
        contentFit="cover"
        accessibilityLabel={label ?? 'Profile photo'}
      />
    </View>
  );
}
