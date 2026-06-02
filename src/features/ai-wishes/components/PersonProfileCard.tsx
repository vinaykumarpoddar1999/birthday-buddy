import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Cake,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Heart,
  Palette,
  Pen,
  Target,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Person } from '@/types/entities';

type Props = {
  person: Person;
  onEditProfile?: () => void;
};

export function PersonProfileCard({ person, onEditProfile }: Props) {
  const [expanded, setExpanded] = useState(false);
  const openProfile = onEditProfile ?? (() => router.push({ pathname: '/person-details', params: { personId: person.id } }));

  const age = useMemo(() => {
    const birthYear = parseInt(person.birthDate.split('-')[0], 10);
    return new Date().getFullYear() - birthYear;
  }, [person.birthDate]);

  const birthdayFormatted = useMemo(() => {
    const d = new Date(person.birthDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [person.birthDate]);

  const daysUntilBirthday = useMemo(() => {
    const now = new Date();
    const birth = new Date(person.birthDate);
    const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (next < now) next.setFullYear(next.getFullYear() + 1);
    return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }, [person.birthDate]);

  const relLabel =
    person.relationship.charAt(0).toUpperCase() + person.relationship.slice(1);

  const genderHeartColor = person.gender === 'female' ? '#EC4899' : '#3B82F6';

  const countdownLabel = daysUntilBirthday === 0
    ? 'Today!'
    : daysUntilBirthday <= 30
      ? `${daysUntilBirthday}d away`
      : '';

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className="mx-5 my-4 bg-white rounded-2xl overflow-hidden border border-gray-100"
      style={{
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
      }}>
      <View className="flex-row items-center p-4">
        <View
          className="h-14 w-14 rounded-2xl overflow-hidden mr-3"
          style={{ backgroundColor: '#F3F0FF' }}>
          {person.avatarUri ? (
            <Image
              source={{ uri: person.avatarUri }}
              style={{ width: 56, height: 56 }}
              contentFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <User size={28} color="#7C3AED" strokeWidth={1.75} />
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[16px] font-bold text-foreground">
              {person.fullName}
            </Text>
            <Heart size={14} color={genderHeartColor} fill={genderHeartColor} strokeWidth={1.75} />
          </View>
          <View className="flex-row items-center gap-3 mt-1">
            <View className="flex-row items-center gap-1">
              <Users size={11} color="#7C3AED" />
              <Text className="text-[11px] text-foreground-muted font-medium">
                {relLabel}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={11} color="#EC4899" />
              <Text className="text-[11px] text-foreground-muted">
                {birthdayFormatted}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Cake size={11} color="#F59E0B" />
              <Text className="text-[11px] text-foreground-muted">
                {age} yrs
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end gap-1.5">
          {countdownLabel ? (
            <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10">
              <Clock size={10} color="#7C3AED" />
              <Text className="text-[10px] font-bold text-primary">{countdownLabel}</Text>
            </View>
          ) : null}
          <Pressable
            onPress={openProfile}
            className="px-2.5 py-1 rounded-lg bg-gray-50 active:bg-gray-100"
            accessibilityRole="button"
            accessibilityLabel="Open profile details">
            <View className="flex-row items-center gap-1">
              <Pen size={10} color="#6B7280" />
              <Text className="text-[10px] font-semibold text-foreground-muted">
                {onEditProfile ? 'Edit' : 'Details'}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {(person.hobbies.length > 0 || person.notes || person.favoriteColor || person.favoriteCake) && (
        <>
          <Pressable
            onPress={() => setExpanded(!expanded)}
            className="flex-row items-center justify-between px-4 py-2.5 border-t border-gray-50 active:bg-gray-50/50"
            accessibilityRole="button">
            <Text className="text-[11px] font-semibold text-foreground-muted tracking-wide">
              ABOUT {person.fullName.split(' ')[0].toUpperCase()}
            </Text>
            {expanded ? (
              <ChevronUp size={14} color="#9CA3AF" />
            ) : (
              <ChevronDown size={14} color="#9CA3AF" />
            )}
          </Pressable>

          {expanded && (
            <Animated.View entering={FadeInDown.duration(200)} className="px-4 pb-3">
              {person.favoriteColor && (
                <InfoRow icon={Palette} label="Favorite Color" value={person.favoriteColor} />
              )}
              {person.favoriteCake && (
                <InfoRow icon={Cake} label="Favorite Cake" value={person.favoriteCake} />
              )}
              {person.hobbies.length > 0 && (
                <InfoRow icon={Target} label="Hobbies" value={person.hobbies.join(', ')} />
              )}
              {person.notes && (
                <InfoRow icon={FileText} label="Notes" value={person.notes} />
              )}
            </Animated.View>
          )}
        </>
      )}
    </Animated.View>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start py-1.5">
      <Icon size={11} color="#7C3AED" strokeWidth={2} style={{ marginRight: 6, marginTop: 1 }} />
      <Text className="text-[11px] text-foreground-muted mr-1">{label}:</Text>
      <Text className="text-[11px] text-foreground font-medium flex-1">{value}</Text>
    </View>
  );
}
