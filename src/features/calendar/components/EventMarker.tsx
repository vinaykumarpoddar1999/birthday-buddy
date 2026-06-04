import { View } from 'react-native';
import { Cake, Gift, Heart, Package } from 'lucide-react-native';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { ProfilePlaceholderVariant } from '@shared/ui/ProfilePlaceholder';
import { EVENT_TYPE_CONFIG } from '../constants/event-types';
import type { EventType } from '../types';

const eventIcons = {
  birthday: Gift,
  anniversary: Cake,
  special: Heart,
  custom: Package,
} as const;

export type EventMarkerProps = {
  type: EventType;
  avatarVariant: ProfilePlaceholderVariant;
  avatarUri?: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
  compact?: boolean;
};

export function EventMarker({
  type,
  avatarUri,
  name,
  gender,
  compact = false,
}: EventMarkerProps) {
  const config = EVENT_TYPE_CONFIG[type];
  const BadgeIcon = eventIcons[type];
  const size = compact ? 'tiny' : 'xs';

  return (
    <View className="items-center">
      <View className="relative">
        <ProfileAvatar
          size={size}
          profileImage={avatarUri}
          name={name}
          gender={gender}
          borderClassName="border border-white"
        />
        <View
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full items-center justify-center border border-white ${config.badgeClass}`}>
          <BadgeIcon size={8} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </View>
    </View>
  );
}

export function EventDot({ type }: { type: EventType }) {
  const config = EVENT_TYPE_CONFIG[type];
  return <View className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />;
}
