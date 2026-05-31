import { Text, View } from 'react-native';
import { MoreVertical, Search, SlidersHorizontal } from 'lucide-react-native';

import { IconButton } from '@shared/ui/IconButton';

export function CalendarHeader() {
  return (
    <View className="flex-row items-start justify-between mb-4">
      <View className="flex-1 pr-3">
        <Text className="text-[26px] leading-[32px] text-foreground font-bold">
          Calendar ✨
        </Text>
        <Text className="text-body text-foreground-secondary mt-0.5">
          Never miss a special day
        </Text>
      </View>
      <View className="flex-row items-center gap-2 shrink-0">
        <IconButton
          icon={Search}
          iconColor="#374151"
          size="sm"
          accessibilityLabel="Search calendar"
          onPress={() => {}}
        />
        <IconButton
          icon={SlidersHorizontal}
          iconColor="#374151"
          size="sm"
          accessibilityLabel="Filter events"
          onPress={() => {}}
        />
        <IconButton
          icon={MoreVertical}
          iconColor="#374151"
          size="sm"
          accessibilityLabel="More options"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}
