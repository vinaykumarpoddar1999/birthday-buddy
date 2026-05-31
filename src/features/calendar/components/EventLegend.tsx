import { ScrollView, Text, View } from 'react-native';
import { Cake, Gift, Heart, Package } from 'lucide-react-native';

import { EVENT_TYPE_CONFIG } from '../constants/event-types';
import type { EventType } from '../types';

const legendItems: { type: EventType; Icon: typeof Gift }[] = [
  { type: 'birthday', Icon: Gift },
  { type: 'anniversary', Icon: Cake },
  { type: 'special', Icon: Heart },
  { type: 'custom', Icon: Package },
];

export function EventLegend() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-5"
      contentContainerClassName="flex-row items-center gap-4 px-1 py-2">
      {legendItems.map(({ type, Icon }) => {
        const config = EVENT_TYPE_CONFIG[type];
        return (
          <View key={type} className="flex-row items-center gap-2 min-h-[44px]">
            <View
              className={`h-7 w-7 rounded-full items-center justify-center ${config.badgeClass}`}>
              <Icon size={14} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <Text className="text-caption text-foreground-secondary font-medium">
              {config.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
