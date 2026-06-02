import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Clock, PartyPopper, Sparkles } from 'lucide-react-native';

import { ConfettiOverlay } from '@shared/ui/ConfettiOverlay';
import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import type { Person } from '@/types/entities';
import {
  formatBirthdayShort,
  formatRelationship,
  getAgeAtNextBirthday,
  getDetailedCountdown,
  getDaysUntilBirthday,
  getNextBirthdayDateTime,
} from '@features/people/utils/birthday-utils';
import { QuickActionsRow, type QuickActionCardProps } from './QuickActionCard';
import { HOME_QUICK_ACTIONS } from '@/constants/home';

const SCREEN_W = Dimensions.get('window').width;
const BANNER_W = SCREEN_W - 40;
const AUTO_ROTATE_MS = 10000;

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

function openPersonProfile(personId: string): void {
  requestAnimationFrame(() => {
    router.push({ pathname: '/person-details', params: { personId } });
  });
}

function buildQuickActions(personId: string): QuickActionCardProps[] {
  return HOME_QUICK_ACTIONS.map((qa) => {
    let onPress: (() => void) | undefined;

    if (qa.title === 'Create Card') {
      onPress = () => router.push({ pathname: '/card-studio', params: { personId } });
    } else if (qa.title === 'Surprise Link') {
      onPress = () => router.push({ pathname: '/surprise-link-studio', params: { personId } });
    } else if (qa.title === 'AI Wish') {
      onPress = () => router.push({ pathname: '/ai-wish', params: { personId } });
    } else if (qa.title === 'Gift Ideas') {
      onPress = () =>
        router.push({ pathname: '/coming-soon', params: { feature: 'gift-ideas' } });
    }

    return { ...qa, onPress };
  });
}

function formatCountdownTimer(birthDate: string, now: Date): string {
  const target = getNextBirthdayDateTime(birthDate);
  const diffMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const LiveCountdown = memo(function LiveCountdown({ birthDate }: { birthDate: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const calendarDays = getDaysUntilBirthday(birthDate);
  const countdown = getDetailedCountdown(birthDate, now);
  const showLiveTimer = calendarDays === 1;

  if (countdown.isToday) {
    return (
      <Text className="text-[16px] text-[#FCD34D] font-black mt-2">Happy Birthday! 🎂</Text>
    );
  }

  if (showLiveTimer) {
    return (
      <View className="mt-2">
        <Text className="text-[11px] text-white/70 font-medium mb-1">Countdown</Text>
        <Text className="text-[32px] text-[#FCD34D] font-black tracking-wider">
          {formatCountdownTimer(birthDate, now)}
        </Text>
        <Text className="text-[12px] text-white/80 mt-0.5">{countdown.primaryLabel}</Text>
      </View>
    );
  }

  return (
    <>
      <Text className="text-[15px] text-[#FCD34D] font-bold mt-1.5">{countdown.primaryLabel}</Text>
      {countdown.secondaryLabel ? (
        <Text className="text-[12px] text-white/80 mt-0.5">{countdown.secondaryLabel}</Text>
      ) : null}
    </>
  );
});

const BannerSlide = memo(function BannerSlide({ item }: { item: BannerItem }) {
  const { person, age, dateLabel, relationship, quickActions } = item;
  const countdown = getDetailedCountdown(person.birthDate);
  const calendarDays = getDaysUntilBirthday(person.birthDate);

  return (
    <View style={{ width: BANNER_W }}>
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          shadowColor: '#5B21B6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.28,
          shadowRadius: 16,
          elevation: 10,
        }}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED', '#5B21B6', '#4C1D95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-3xl overflow-hidden">
          {countdown.isToday && <ConfettiOverlay />}

          <View className="px-5 pt-5 pb-0">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-3 min-w-0">
                <View className="flex-row items-center gap-1.5 mb-1">
                  {countdown.isToday ? (
                    <PartyPopper size={12} color="#FCD34D" />
                  ) : (
                    <Clock size={12} color="rgba(255,255,255,0.75)" />
                  )}
                  <Text className="text-[11px] text-white/75 font-medium">
                    {countdown.isToday
                      ? 'Celebration Day!'
                      : calendarDays === 1
                        ? 'Tomorrow'
                        : countdown.primaryLabel}
                  </Text>
                </View>
                <Text className="text-caption text-white/75 mb-0.5">
                  {countdown.isToday ? '🎉 Birthday Today!' : 'Next Birthday'}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => openPersonProfile(person.id)}>
                  <Text className="text-[22px] leading-[28px] text-white font-bold" numberOfLines={1}>
                    {person.fullName}
                  </Text>
                </Pressable>
                <Text className="text-body text-white/90 mt-1">
                  {formatRelationship(relationship)} · Turns {age} on {dateLabel}
                </Text>
                <LiveCountdown birthDate={person.birthDate} />
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => openPersonProfile(person.id)}
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
    </View>
  );
});

export function UpcomingBirthdayBanner({ people }: UpcomingBirthdayBannerProps) {
  const listRef = useRef<FlatList<BannerItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const userInteractingRef = useRef(false);
  const activeIndexRef = useRef(0);

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

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      if (items.length === 0) return;
      const clamped = ((index % items.length) + items.length) % items.length;
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      listRef.current?.scrollToOffset({ offset: clamped * BANNER_W, animated });
    },
    [items.length],
  );

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      if (userInteractingRef.current) return;
      scrollToIndex(activeIndexRef.current + 1);
    }, AUTO_ROTATE_MS);

    return () => clearInterval(interval);
  }, [items.length, scrollToIndex]);

  const goTo = useCallback(
    (index: number) => {
      userInteractingRef.current = true;
      scrollToIndex(index);
      setTimeout(() => {
        userInteractingRef.current = false;
      }, AUTO_ROTATE_MS);
    },
    [scrollToIndex],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<BannerItem>[] }) => {
      const idx = viewableItems[0]?.index;
      if (idx != null && idx >= 0) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const onScrollBeginDrag = useCallback(() => {
    userInteractingRef.current = true;
  }, []);

  const onScrollEndDrag = useCallback(() => {
    setTimeout(() => {
      userInteractingRef.current = false;
    }, AUTO_ROTATE_MS);
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_W);
      if (idx >= 0 && idx < items.length) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
    },
    [items.length],
  );

  const renderItem = useCallback(
    ({ item }: { item: BannerItem }) => <BannerSlide item={item} />,
    [],
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
        renderItem={renderItem}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: BANNER_W, offset: BANNER_W * index, index })}
        decelerationRate="fast"
        bounces={items.length > 1}
        nestedScrollEnabled
        removeClippedSubviews={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
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
