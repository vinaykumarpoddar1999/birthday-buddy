import { Pressable, Text, View } from 'react-native';
import { Bell, Crown, Search, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

import { IconButton } from '@shared/ui/IconButton';
import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import { useActivityStore } from '@features/profile/store/activity.store';

export type AppHeaderProps = {
  userName: string;
  notificationCount?: number;
};

export function AppHeader({ userName }: AppHeaderProps) {
  const unreadCount = useActivityStore((s) => s.notifications.filter((n) => !n.isRead).length);

  return (
    <View className="flex-row items-center justify-between mb-5">
      <Pressable
        className="flex-row items-center gap-3 flex-1 pr-2"
        onPress={() => router.push('/(tabs)/profile')}
        accessibilityRole="button"
        accessibilityLabel="Open profile">
        <View className="relative">
          <ProfilePlaceholder
            size="header"
            variant="user"
            borderClassName="border-2 border-primary/20"
            label={`${userName} avatar`}
          />
          <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent-gold border-2 border-surface items-center justify-center">
            <Crown size={9} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>
        <View className="flex-1 shrink">
          <Text className="text-[17px] leading-[22px] text-foreground font-bold" numberOfLines={1}>
            Good morning, {userName}
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Sparkles size={12} color="#7C3AED" strokeWidth={2} />
            <Text className="text-caption text-foreground-secondary flex-1" numberOfLines={2}>
              Make every birthday unforgettable
            </Text>
          </View>
        </View>
      </Pressable>
      <View className="flex-row items-center gap-2 shrink-0">
        <IconButton icon={Search} iconColor="#374151" onPress={() => router.push('/search')} />
        <IconButton icon={Bell} iconColor="#374151" badge={unreadCount} onPress={() => router.push('/notifications')} />
      </View>
    </View>
  );
}
