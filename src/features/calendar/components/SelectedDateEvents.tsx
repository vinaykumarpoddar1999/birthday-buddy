import { router } from 'expo-router';
import { Cake, ChevronRight, Link2, Sparkles, Wand2 } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { Person } from '@/types/entities';
import { formatRelationship, getAgeAtNextBirthday } from '@features/people/utils/birthday-utils';

export type SelectedDateEventsProps = {
  year: number;
  month: number;
  day: number;
  people: Person[];
};

export function SelectedDateEvents({ year, month, day, people }: SelectedDateEventsProps) {
  if (people.length === 0) {
    return (
      <View className="mt-4 bg-surface rounded-xl border border-border p-4">
        <Text className="text-[13px] text-foreground-secondary text-center">
          No birthdays on {month}/{day}/{year}
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text className="text-[13px] font-bold text-foreground mb-2">
        {people.length} celebration{people.length === 1 ? '' : 's'} on this day
      </Text>
      {people.map((person) => (
        <View key={person.id} className="mb-2">
          <Pressable
            onPress={() => router.push(`/person-details?personId=${person.id}`)}
            className="bg-surface rounded-xl border border-border/60 p-3 flex-row items-center"
            accessibilityRole="button">
            <ProfileAvatar
              size="md"
              profileImage={person.avatarUri}
              gender={person.gender}
              borderClassName="border border-primary/20 mr-3"
              label={`${person.fullName} avatar`}
            />
            <View className="flex-1 min-w-0">
              <Text className="text-[14px] font-bold text-foreground" numberOfLines={1}>
                {person.fullName}
              </Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5">
                {formatRelationship(person.relationship)} · Turns {getAgeAtNextBirthday(person.birthDate)}
              </Text>
            </View>
            <Cake size={16} color="#7C3AED" />
            <ChevronRight size={16} color="#9CA3AF" style={{ marginLeft: 4 }} />
          </Pressable>
          <View className="flex-row gap-2 mt-1.5">
            <Pressable
              onPress={() => router.push({ pathname: '/surprise-link-studio', params: { personId: person.id } })}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10"
              accessibilityRole="button"
              accessibilityLabel="Create Surprise">
              <Link2 size={13} color="#7C3AED" />
              <Text className="text-[11px] font-bold text-primary">Surprise</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push({ pathname: '/ai-wish', params: { personId: person.id } })}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary/10"
              accessibilityRole="button"
              accessibilityLabel="AI Wish">
              <Wand2 size={13} color="#EC4899" />
              <Text className="text-[11px] font-bold text-secondary">AI Wish</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push({ pathname: '/card-studio', params: { personId: person.id } })}
              className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50"
              accessibilityRole="button"
              accessibilityLabel="Create Card">
              <Sparkles size={13} color="#3B82F6" />
              <Text className="text-[11px] font-bold text-blue-600">Card</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
