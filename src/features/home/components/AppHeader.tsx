import { Text, View } from 'react-native';
import { Bell, Search } from 'lucide-react-native';

import { IconButton } from '@shared/ui/IconButton';
import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';

export type AppHeaderProps = {
  userName: string;
  notificationCount?: number;
};

export function AppHeader({ userName, notificationCount = 3 }: AppHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-5">
      <View className="flex-row items-center gap-3 flex-1 pr-2">
        <View className="relative">
          <ProfilePlaceholder
            size="header"
            variant="user"
            borderClassName="border-2 border-primary/20"
            label={`${userName} avatar`}
          />
          <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent-gold border-2 border-surface items-center justify-center">
            <Text className="text-[9px]">👑</Text>
          </View>
        </View>
        <View className="flex-1 shrink">
          <Text className="text-[17px] leading-[22px] text-foreground font-bold" numberOfLines={1}>
            Good morning, {userName} 👋
          </Text>
          <Text className="text-caption text-foreground-secondary mt-0.5" numberOfLines={2}>
            Make every birthday unforgettable ✨
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2 shrink-0">
        <IconButton icon={Search} iconColor="#374151" onPress={() => {}} />
        <IconButton icon={Bell} iconColor="#374151" badge={notificationCount} onPress={() => {}} />
      </View>
    </View>
  );
}
