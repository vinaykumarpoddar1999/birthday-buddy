import { Pressable, Text, View } from 'react-native';
import { Bell, Cake, Crown, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { IconButton } from '@shared/ui/IconButton';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { useNotificationStore } from '@/stores/notification.store';
import { useProfileStore } from '@features/profile/store/profile.store';

export type AppHeaderProps = {
  userName: string;
  notificationCount?: number;
};

export function AppHeader({ userName }: AppHeaderProps) {
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.isRead).length);
  const profile = useProfileStore((s) => s.profile);
  const displayName = profile.fullName || userName;

  return (
    <View className="mb-6">
      <LinearGradient
        colors={['#FFFFFF', '#FAF5FF', '#FDF2F8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl border border-primary/10 overflow-hidden"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 14,
          elevation: 4,
        }}>
        <View className="px-4 pt-4 pb-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              className="flex-row items-center gap-3 flex-1 pr-2"
              onPress={() => router.push('/(tabs)/profile')}
              accessibilityRole="button"
              accessibilityLabel="Open profile">
              <View className="relative">
                <ProfileAvatar
                  size="header"
                  profileImage={profile.profileImage}
                  name={profile.fullName}
                  gender={profile.gender}
                  borderClassName="border-2 border-primary/25"
                  label={`${displayName} avatar`}
                />
                {profile.isPremium && (
                  <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent-gold border-2 border-surface items-center justify-center">
                    <Crown size={9} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                )}
              </View>
              <View className="flex-1 shrink py-0.5">
                <View className="flex-row items-center gap-2">
                  <View className="h-7 w-7 rounded-lg bg-primary/12 items-center justify-center">
                    <Cake size={15} color="#7C3AED" strokeWidth={2.2} />
                  </View>
                  <View className="flex-1 min-w-0">
                    <Text
                      className="text-[20px] leading-[24px] font-black text-foreground"
                      style={{ letterSpacing: -0.3 }}
                      numberOfLines={1}>
                      Birthday Buddy
                    </Text>
                    <Text className="text-[11px] text-foreground-secondary mt-0.5 font-semibold" numberOfLines={1}>
                      Make Every Birthday Special
                    </Text>
                  </View>
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
        </View>
        <LinearGradient
          colors={['#7C3AED', '#EC4899', '#F59E0B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-[3px]"
        />
      </LinearGradient>
    </View>
  );
}
