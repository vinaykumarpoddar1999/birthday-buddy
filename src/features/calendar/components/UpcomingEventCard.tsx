import { Pressable, Text, View } from 'react-native';
import {
  Gift,
  Send,
  Wand2,
  CreditCard,
  Cake,
  Heart,
  Package,
  type LucideIcon,
} from 'lucide-react-native';
import { router } from 'expo-router';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import { EVENT_TYPE_CONFIG } from '../constants/event-types';
import type { UpcomingEvent, UpcomingEventActionIcon, EventType } from '../types';

const actionIconMap: Record<UpcomingEventActionIcon, LucideIcon> = {
  send: Send,
  gift: Gift,
  wand: Wand2,
  card: CreditCard,
  sparkles: Gift,
};

const eventBadgeIcons: Record<EventType, LucideIcon> = {
  birthday: Gift,
  anniversary: Cake,
  special: Heart,
  custom: Package,
};

export type UpcomingEventCardProps = {
  event: UpcomingEvent;
};

function ActionButton({
  label,
  icon,
}: {
  label: string;
  icon: UpcomingEventActionIcon;
}) {
  const Icon = actionIconMap[icon];

  const handlePress = () => {
    if (label === 'Create Card') {
      router.push('/card-studio');
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={handlePress}
      className="flex-row items-center justify-center border border-border rounded-lg px-2 py-1.5 min-h-[32px] bg-surface gap-1">
      <Icon size={12} color="#7C3AED" strokeWidth={2} />
      <Text className="text-[10px] text-foreground font-semibold">{label}</Text>
    </Pressable>
  );
}

export function UpcomingEventCard({ event }: UpcomingEventCardProps) {
  const typeConfig = EVENT_TYPE_CONFIG[event.type];
  const BadgeIcon = eventBadgeIcons[event.type];

  return (
    <View
      className={`${event.cardTint} rounded-xl border border-border/60 p-3.5 mb-3 flex-row items-center shadow-card`}>
      <View className="w-[52px] items-center mr-3 shrink-0">
        <Text className="text-[22px] leading-6 text-foreground font-bold">{event.day}</Text>
        <Text className="text-[10px] text-foreground-secondary font-bold tracking-wide">
          {event.weekday}
        </Text>
        <Text className="text-[9px] text-foreground-muted font-semibold">{event.month}</Text>
      </View>

      <View className="flex-1 flex-row items-center min-w-0 mr-2">
        <View className="relative mr-2.5 shrink-0">
          <ProfilePlaceholder size="md" variant={event.avatarVariant} />
          <View
            className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full items-center justify-center border border-white ${typeConfig.badgeClass}`}>
            <BadgeIcon size={9} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-body text-foreground font-bold" numberOfLines={1}>
            {event.name}
          </Text>
          <Text className="text-caption text-foreground-secondary mt-0.5" numberOfLines={1}>
            {event.description}
          </Text>
          <Text className="text-caption text-primary font-semibold mt-1">{event.countdown}</Text>
        </View>
      </View>

      <View className="gap-1.5 shrink-0 w-[88px]">
        <ActionButton label={event.primaryAction.label} icon={event.primaryAction.icon} />
        <ActionButton label={event.secondaryAction.label} icon={event.secondaryAction.icon} />
      </View>
    </View>
  );
}
