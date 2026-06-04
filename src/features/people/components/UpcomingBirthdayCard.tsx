import { Pressable, Text, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { router } from 'expo-router';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { RelationshipBadge } from './RelationshipBadge';
import type { BirthdayEvent } from '../types';

type UpcomingBirthdayCardProps = {
  item: BirthdayEvent;
};

const eventStateColors: Record<string, string> = {
  tomorrow: '#EC4899',
  in2days: '#22C55E',
  in3days: '#F59E0B',
  in5days: '#7C3AED',
  in7days: '#8B5CF6',
  in10days: '#6B7280',
};

export function UpcomingBirthdayCard({ item }: UpcomingBirthdayCardProps) {
  const color = eventStateColors[item.eventState] || '#6B7280';

  return (
    <View className="bg-surface rounded-2xl border border-border px-4 py-3.5 mb-3 shadow-sm">
      <View className="flex-row items-center gap-3">
        <ProfileAvatar
          size="header"
          profileImage={item.avatarUri}
          name={item.name}
          gender={item.gender}
          label={`${item.name} avatar`}
        />

        <View className="flex-1 min-w-0 mr-2">
          <Text className="text-[15px] text-foreground font-semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-[12px] mt-0.5 font-medium" style={{ color }}>
            {item.eventLabel}
          </Text>
          <View className="flex-row items-center gap-2 mt-1.5">
            <RelationshipBadge relationship={item.relationship} />
            <Text className="text-[11px] text-foreground-muted">
              Turning {item.age}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push({ pathname: '/ai-wish', params: { personId: item.id } })}
          className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center shrink-0"
          accessibilityRole="button"
          accessibilityLabel="Send wish">
          <Send size={15} color="#7C3AED" />
        </Pressable>
      </View>
    </View>
  );
}
