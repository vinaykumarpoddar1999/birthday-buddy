import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { Cake, Calendar, Users } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { Person } from '@/types/entities';
import { getAge } from '@features/people/utils/birthday-utils';
import { WishShadows } from '../constants/design-tokens';

type Props = {
  person: Person;
};

export function PersonProfileCard({ person }: Props) {
  const age = useMemo(() => getAge(person.birthDate), [person.birthDate]);

  const birthdayFormatted = useMemo(() => {
    const d = new Date(person.birthDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [person.birthDate]);

  const relLabel =
    person.relationship.charAt(0).toUpperCase() + person.relationship.slice(1);

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className="mx-5 my-4 bg-surface rounded-2xl border border-border/80 p-4"
      style={WishShadows.sm}>
      <View className="flex-row items-center gap-3">
        <ProfileAvatar
          size="lg"
          profileImage={person.avatarUri}
          gender={person.gender}
          borderClassName="border-2 border-primary/15"
          label={`${person.fullName} avatar`}
        />

        <View className="flex-1 min-w-0">
          <Text className="text-[17px] font-bold text-foreground" numberOfLines={1}>
            {person.fullName}
          </Text>

          <View className="flex-row items-center gap-1 mt-1.5">
            <Users size={12} color="#7C3AED" />
            <Text className="text-[12px] text-foreground-secondary font-medium">
              {relLabel}
            </Text>
          </View>

          <View className="flex-row items-center gap-3 mt-1.5">
            <View className="flex-row items-center gap-1">
              <Calendar size={11} color="#EC4899" />
              <Text className="text-[12px] text-foreground-muted">{birthdayFormatted}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Cake size={11} color="#F59E0B" />
              <Text className="text-[12px] text-foreground-muted">{age} years</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
