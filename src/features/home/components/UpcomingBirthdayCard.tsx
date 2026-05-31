import { Text, View, Pressable } from 'react-native';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import type { ProfilePlaceholderVariant } from '@shared/ui/ProfilePlaceholder';

export type UpcomingBirthdayCardProps = {
  name: string;
  date: string;
  badge: string;
  avatarVariant: ProfilePlaceholderVariant;
  bgClass: string;
  badgeClass: string;
};

export function UpcomingBirthdayCard({
  name,
  date,
  badge,
  avatarVariant,
  bgClass,
  badgeClass,
}: UpcomingBirthdayCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`${bgClass} rounded-lg py-3.5 px-2.5 mr-3 w-[100px] items-center`}
      onPress={() => {}}>
      <View className="relative mb-2.5">
        <ProfilePlaceholder size="md" variant={avatarVariant} />
        <View
          className={`absolute -top-0.5 -right-1 ${badgeClass} min-w-[24px] h-[22px] rounded-full items-center justify-center px-1 border-2 border-white`}>
          <Text className="text-[10px] font-bold text-white">{badge}</Text>
        </View>
      </View>
      <Text className="text-[11px] text-foreground font-semibold text-center" numberOfLines={2}>
        {name}
      </Text>
      <Text className="text-[11px] text-foreground-secondary mt-1">{date}</Text>
    </Pressable>
  );
}
