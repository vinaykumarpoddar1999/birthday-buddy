import { Text, View } from 'react-native';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import { RelationshipBadge } from './RelationshipBadge';
import { ActionIconButton } from './ActionIconButton';
import type { BirthdayEvent } from '../types';

type UpcomingBirthdayCardProps = {
  item: BirthdayEvent;
};

const eventStateClassMap = {
  tomorrow: 'text-secondary',
  in2days: 'text-success',
  in3days: 'text-warning',
  in5days: 'text-primary',
  in7days: 'text-violet-500',
  in10days: 'text-foreground-secondary',
} as const;

export function UpcomingBirthdayCard({ item }: UpcomingBirthdayCardProps) {
  return (
    <View className="flex-row items-center rounded-2xl bg-surface border border-border/80 px-3 py-2.5 mb-2.5">
      <ProfilePlaceholder
        size="header"
        variant={item.gender === 'female' ? 'female' : 'user'}
        label={item.name}
        className="mr-3"
      />

      <View className="flex-1 pr-2">
        <Text className="text-body text-foreground font-semibold">{item.name}</Text>
        <Text className={`text-caption mt-0.5 ${eventStateClassMap[item.eventState]}`}>
          {item.eventLabel}
        </Text>
        <View className="mt-1">
          <RelationshipBadge relationship={item.relationship} />
        </View>
      </View>

      <View className="items-end">
        <Text className="text-[24px] leading-[24px] text-secondary font-bold">{item.age}</Text>
        <Text className="text-[10px] text-foreground-secondary mb-1.5">Years</Text>
        <ActionIconButton action="wish" onPress={() => {}} />
      </View>
    </View>
  );
}
