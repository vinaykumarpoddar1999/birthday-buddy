import { Pressable, Text, View } from 'react-native';
import { Bell, Crown, Search, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { useMemo } from 'react';

import { IconButton } from '@shared/ui/IconButton';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { useActivityStore } from '@features/profile/store/activity.store';
import { useProfileStore } from '@features/profile/store/profile.store';

export type AppHeaderProps = {
  userName: string;
  notificationCount?: number;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function AppHeader({ userName }: AppHeaderProps) {
  const unreadCount = useActivityStore((s) => s.notifications.filter((n) => !n.isRead).length);
  const profile = useProfileStore((s) => s.profile);
  const displayName = profile.fullName || userName;
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <View className="flex-row items-center justify-between mb-5">
      <Pressable
        className="flex-row items-center gap-3 flex-1 pr-2"
        onPress={() => router.push('/(tabs)/profile')}
        accessibilityRole="button"
        accessibilityLabel="Open profile and settings">
        <View className="relative">
          <ProfileAvatar
            size="header"
            profileImage={profile.profileImage}
            gender={profile.gender}
            borderClassName="border-2 border-primary/20"
            label={`${displayName} avatar`}
          />
          {profile.isPremium && (
            <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent-gold border-2 border-surface items-center justify-center">
              <Crown size={9} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          )}
        </View>
        <View className="flex-1 shrink">
          <Text className="text-[17px] leading-[22px] text-foreground font-bold" numberOfLines={1}>
            {greeting}, {displayName.split(' ')[0] || 'there'}
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Sparkles size={12} color="#7C3AED" strokeWidth={2} />
            <Text className="text-caption text-foreground-secondary flex-1" numberOfLines={2}>
              {unreadCount > 0
                ? `${unreadCount} new notification${unreadCount === 1 ? '' : 's'} — tap bell to view`
                : 'Make every birthday unforgettable'}
            </Text>
          </View>
        </View>
      </Pressable>
      <View className="flex-row items-center gap-2 shrink-0">
        <IconButton icon={Search} iconColor="#374151" onPress={() => router.push('/search')} />
        <View className="relative">
          <IconButton
            icon={Bell}
            iconColor={unreadCount > 0 ? '#7C3AED' : '#374151'}
            badge={unreadCount > 0 ? unreadCount : undefined}
            onPress={() => router.push('/notifications')}
          />
          {unreadCount > 0 && (
            <View className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
          )}
        </View>
      </View>
    </View>
  );
}
