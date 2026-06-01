import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react-native';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { Person } from '@/types/entities';
import {
  formatBirthdayShort,
  formatRelationship,
  getAgeAtNextBirthday,
  getDetailedCountdown,
} from '@features/people/utils/birthday-utils';
import { QuickActionsRow, type QuickActionCardProps } from './QuickActionCard';
import { HOME_QUICK_ACTIONS } from '@/constants/home';

const SCREEN_W = Dimensions.get('window').width;
const BANNER_W = SCREEN_W - 40;

export type UpcomingBirthdayBannerProps = {
  people: Person[];
};

type BannerItem = {
  person: Person;
  age: number;
  dateLabel: string;
  relationship: string;
  quickActions: QuickActionCardProps[];
};

function buildQuickActions(personId: string): QuickActionCardProps[] {
  return HOME_QUICK_ACTIONS.map((qa) => {
    let onPress: (() => void) | undefined;

    if (qa.title === 'Create Card' || qa.title === 'Surprise Card') {
      onPress = () => router.push({ pathname: '/card-studio', params: { personId } });
    } else if (qa.title === 'AI Wish' || qa.title === 'Gift Ideas') {
      onPress = () => router.push({ pathname: '/ai-wish', params: { personId } });
    }

    return { ...qa, onPress };
  });
}

function BannerSlide({ item, liveTime }: { item: BannerItem; liveTime: string }) {
  const { person, age, dateLabel, relationship, quickActions } = item;
  const countdown = getDetailedCountdown(person.birthDate);

  return (
    <View style={{ width: BANNER_W }}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#5B21B6', '#4C1D95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl overflow-hidden shadow-lg">
        <View className="px-5 pt-5 pb-0">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-3 min-w-0">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Clock size={12} color="rgba(255,255,255,0.75)" />
                <Text className="text-[11px] text-white/75 font-medium">{liveTime}</Text>
              </View>
              <Text className="text-caption text-white/75 mb-0.5">
                {countdown.isToday ? 'Birthday Today' : 'Next Birthday'}
              </Text>
              <Text className="text-[22px] leading-[28px] text-white font-bold" numberOfLines={1}>
                {person.fullName}
              </Text>
              <Text className="text-body text-white/90 mt-1">
                {formatRelationship(relationship)} · Turns {age} on {dateLabel}
              </Text>
              <Text className="text-[15px] text-[#FCD34D] font-bold mt-1.5">
                {countdown.primaryLabel}
              </Text>
              <Text className="text-[12px] text-white/80 mt-0.5">{countdown.secondaryLabel}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: '/add-person', params: { personId: person.id } })
              }
              className="items-center">
              <ProfileAvatar
                size="xl"
                profileImage={person.avatarUri}
                gender={person.gender}
                borderClassName="border-4 border-white/40"
                label={`${person.fullName} avatar`}
              />
            </Pressable>
          </View>
        </View>
        <QuickActionsRow actions={quickActions} />
      </LinearGradient>
    </View>
  );
}

export function UpcomingBirthdayBanner({ people }: UpcomingBirthdayBannerProps) {
  const listRef = useRef<FlatList<BannerItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  );
  const [, setTick] = useState(0);

  const items = useMemo<BannerItem[]>(
    () =>
      people.map((person) => ({
        person,
        age: getAgeAtNextBirthday(person.birthDate),
        dateLabel: formatBirthdayShort(person.birthDate),
        relationship: person.relationship,
        quickActions: buildQuickActions(person.id),
      })),
    [people],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const rotate = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % items.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 8000);
    return () => clearInterval(rotate);
  }, [items.length]);

  const goTo = useCallback(
    (index: number) => {
      if (items.length === 0) return;
      const clamped = ((index % items.length) + items.length) % items.length;
      setActiveIndex(clamped);
      listRef.current?.scrollToIndex({ index: clamped, animated: true });
    },
    [items.length],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_W);
      if (idx >= 0 && idx < items.length) setActiveIndex(idx);
    },
    [items.length],
  );

  if (items.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-2 px-0.5">
        <View className="flex-row items-center gap-1.5">
          <Sparkles size={14} color="#7C3AED" />
          <Text className="text-[13px] font-bold text-foreground">Upcoming Celebrations</Text>
        </View>
        {items.length > 1 ? (
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => goTo(activeIndex - 1)}
              className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Previous birthday">
              <ChevronLeft size={18} color="#7C3AED" />
            </Pressable>
            <Pressable
              onPress={() => goTo(activeIndex + 1)}
              className="h-8 w-8 rounded-full bg-primary/10 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Next birthday">
              <ChevronRight size={18} color="#7C3AED" />
            </Pressable>
          </View>
        ) : null}
      </View>

      <FlatList
        ref={listRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.person.id}
        onMomentumScrollEnd={onScroll}
        getItemLayout={(_, index) => ({ length: BANNER_W, offset: BANNER_W * index, index })}
        renderItem={({ item }) => <BannerSlide item={item} liveTime={liveTime} />}
        snapToInterval={BANNER_W}
        decelerationRate="fast"
      />

      {items.length > 1 ? (
        <View className="flex-row justify-center gap-1.5 mt-3">
          {items.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              accessibilityRole="button"
              accessibilityLabel={`Go to birthday ${i + 1}`}>
              <View
                className={`h-1.5 rounded-full ${i === activeIndex ? 'w-5 bg-primary' : 'w-1.5 bg-primary/25'}`}
              />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
