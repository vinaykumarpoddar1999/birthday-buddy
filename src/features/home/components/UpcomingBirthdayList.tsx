import { router } from 'expo-router';
import { Cake, ChevronRight, Clock, Gift, Link2, Sparkles, User } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { Person } from '@/types/entities';
import {
  formatBirthdayShort,
  formatRelationship,
  getAgeAtNextBirthday,
  getDaysUntilBirthday,
  getDetailedCountdown,
} from '@features/people/utils/birthday-utils';

const ACCENT_GRADIENTS: [string, string][] = [
  ['#8B5CF6', '#6D28D9'],
  ['#EC4899', '#DB2777'],
  ['#3B82F6', '#2563EB'],
  ['#14B8A6', '#0D9488'],
  ['#F59E0B', '#D97706'],
];

export type UpcomingBirthdayListProps = {
  people: Person[];
};

function StatusBadge({
  countdown,
  days,
  gradient,
}: {
  countdown: ReturnType<typeof getDetailedCountdown>;
  days: number;
  gradient: [string, string];
}) {
  if (countdown.isToday) {
    return (
      <View className="bg-accent-gold rounded-full px-2.5 py-1 flex-row items-center gap-1">
        <Cake size={11} color="#92400E" />
        <Text className="text-[10px] font-bold text-amber-900">Today</Text>
      </View>
    );
  }
  if (days === 1) {
    return (
      <View className="rounded-full px-2.5 py-1 flex-row items-center gap-1" style={{ backgroundColor: `${gradient[0]}22` }}>
        <Clock size={11} color={gradient[0]} />
        <Text className="text-[10px] font-bold" style={{ color: gradient[0] }}>
          {countdown.primaryLabel}
        </Text>
      </View>
    );
  }
  return (
    <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: `${gradient[0]}18` }}>
      <Text className="text-[10px] font-bold" style={{ color: gradient[0] }}>
        {countdown.primaryLabel}
      </Text>
    </View>
  );
}

function ListItem({ person, index }: { person: Person; index: number }) {
  const days = getDaysUntilBirthday(person.birthDate);
  const countdown = getDetailedCountdown(person.birthDate);
  const age = getAgeAtNextBirthday(person.birthDate);
  const gradient = ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length];
  const isSoon = days <= 7;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${person.fullName} details`}
      onPress={() => router.push({ pathname: '/person-details', params: { personId: person.id } })}
      className="mb-3">
      <View
        className="bg-surface rounded-3xl overflow-hidden border border-border/40"
        style={{
          shadowColor: gradient[0],
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 3,
        }}>
        <LinearGradient
          colors={[`${gradient[0]}14`, `${gradient[1]}06`, '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 py-3.5">
          <View className="flex-row items-center">
            <View className="relative mr-3">
              <ProfileAvatar
                size="lg"
                profileImage={person.avatarUri}
                gender={person.gender}
                borderClassName={`border-2 ${countdown.isToday ? 'border-accent-gold' : 'border-primary/20'}`}
                label={`${person.fullName} avatar`}
              />
              <View
                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full items-center justify-center border border-white"
                style={{ backgroundColor: gradient[0] }}>
                <User size={10} color="#FFFFFF" />
              </View>
            </View>

            <View className="flex-1 min-w-0">
              <View className="flex-row items-center gap-2 mb-0.5">
                <Text className="text-[16px] font-black text-foreground flex-1" numberOfLines={1}>
                  {person.fullName}
                </Text>
                <StatusBadge countdown={countdown} days={days} gradient={gradient} />
              </View>
              <Text className="text-[12px] text-foreground-secondary font-medium" numberOfLines={1}>
                {formatRelationship(person.relationship)} · Turns {age}
              </Text>
              <Text className="text-[11px] text-foreground-muted mt-0.5">
                {formatBirthdayShort(person.birthDate)}
                {!countdown.isToday && countdown.secondaryLabel ? ` · ${countdown.secondaryLabel}` : ''}
              </Text>
            </View>

            <ChevronRight size={18} color="#9CA3AF" style={{ marginLeft: 8 }} />
          </View>

          {isSoon && (
            <View className="flex-row gap-2 mt-2.5 pt-2.5 border-t border-border/30">
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  router.push({ pathname: '/person-details', params: { personId: person.id } });
                }}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xl bg-foreground/5"
                accessibilityRole="button">
                <User size={14} color="#374151" />
                <Text className="text-[11px] font-bold text-foreground">Profile</Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  router.push({ pathname: '/ai-wish', params: { personId: person.id } });
                }}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10"
                accessibilityRole="button">
                <Sparkles size={14} color="#7C3AED" />
                <Text className="text-[11px] font-bold text-primary">Wish</Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  router.push({ pathname: '/surprise-link-studio', params: { personId: person.id } });
                }}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/5 border border-primary/15"
                accessibilityRole="button">
                <Link2 size={14} color="#7C3AED" />
                <Text className="text-[11px] font-bold text-primary">Surprise</Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  router.push({ pathname: '/card-studio', params: { personId: person.id } });
                }}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xl bg-secondary/10 border border-secondary/20"
                accessibilityRole="button">
                <Gift size={14} color="#EC4899" />
                <Text className="text-[11px] font-bold text-secondary">Card</Text>
              </Pressable>
            </View>
          )}
        </LinearGradient>
      </View>
    </Pressable>
  );
}

export function UpcomingBirthdayList({ people }: UpcomingBirthdayListProps) {
  if (people.length === 0) return null;

  return (
    <View className="mb-5">
      {people.map((person, index) => (
        <ListItem key={person.id} person={person} index={index} />
      ))}
    </View>
  );
}
