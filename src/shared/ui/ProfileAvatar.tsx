import { useState } from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { InitialAvatar } from '@/shared/ui/InitialAvatar';
import { getAvatarSource, hasGenderAvatar } from '@/shared/utils/avatar';

import type { ProfilePlaceholderSize } from '@shared/ui/ProfilePlaceholder';

export type ProfileAvatarProps = {
  size?: ProfilePlaceholderSize;
  /** Overrides preset size (square px). */
  dimension?: number;
  profileImage?: string | null;
  name?: string | null;
  gender?: 'male' | 'female' | 'other';
  borderClassName?: string;
  className?: string;
  label?: string;
};

const SIZE_PX: Record<ProfilePlaceholderSize, number> = {
  tiny: 24,
  xs: 32,
  sm: 44,
  header: 48,
  md: 56,
  lg: 80,
  xl: 112,
};

export function ProfileAvatar({
  size = 'md',
  dimension,
  profileImage,
  name,
  gender,
  borderClassName = '',
  className = '',
  label,
}: ProfileAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const useRemote = Boolean(profileImage) && !imageFailed;
  const px = dimension ?? SIZE_PX[size];
  const borderRadius = px / 2;
  const containerClass = `overflow-hidden ${borderClassName} ${className}`.trim() || undefined;

  if (useRemote) {
    return (
      <View className={containerClass} style={{ width: px, height: px, borderRadius }}>
        <Image
          source={{ uri: profileImage! }}
          style={{ width: px, height: px }}
          contentFit="cover"
          accessibilityLabel={label ?? name ?? 'Profile photo'}
          onError={() => setImageFailed(true)}
        />
      </View>
    );
  }

  if (hasGenderAvatar(gender)) {
    return (
      <View className={containerClass} style={{ width: px, height: px, borderRadius }}>
        <Image
          source={getAvatarSource(gender)}
          style={{ width: px, height: px }}
          contentFit="cover"
          accessibilityLabel={label ?? name ?? 'Profile avatar'}
        />
      </View>
    );
  }

  if (name?.trim()) {
    return (
      <InitialAvatar
        name={name}
        size={size}
        dimension={dimension}
        borderClassName={borderClassName}
        className={className}
      />
    );
  }

  return (
    <View
      className={containerClass}
      style={{ width: px, height: px, borderRadius }}
      accessibilityLabel={label ?? 'Profile placeholder'}>
      <InitialAvatar name={null} size={size} dimension={dimension} />
    </View>
  );
}
