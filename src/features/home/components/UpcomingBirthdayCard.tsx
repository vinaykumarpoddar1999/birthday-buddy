import { router } from 'expo-router';
import { Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Cake } from 'lucide-react-native';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import type { ProfilePlaceholderVariant } from '@shared/ui/ProfilePlaceholder';

export type UpcomingBirthdayCardProps = {
  id: string;
  name: string;
  date: string;
  badge: string;
  avatarVariant: ProfilePlaceholderVariant;
  bgClass: string;
  badgeClass: string;
};

export function UpcomingBirthdayCard({
  id,
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
      className="mr-3 w-[108px]"
      onPress={() =>
        router.push({ pathname: '/add-person', params: { personId: id } })
      }>
      <LinearGradient
        colors={['#FFFFFF', '#F5F3FF']}
        className={`${bgClass} rounded-2xl py-3.5 px-2.5 items-center border border-primary/15`}
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
        }}>
        <View className="relative mb-2.5">
          <ProfilePlaceholder size="md" variant={avatarVariant} name={name} />
          <View
            className={`absolute -top-0.5 -right-1 ${badgeClass} min-w-[26px] h-[22px] rounded-full items-center justify-center px-1 border-2 border-white`}>
            <Text className="text-[10px] font-bold text-white">{badge}</Text>
          </View>
        </View>
        <Text className="text-[11px] text-foreground font-bold text-center" numberOfLines={2}>
          {name}
        </Text>
        <View className="flex-row items-center gap-1 mt-1">
          <Cake size={10} color="#7C3AED" />
          <Text className="text-[10px] text-foreground-secondary font-medium">{date}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
