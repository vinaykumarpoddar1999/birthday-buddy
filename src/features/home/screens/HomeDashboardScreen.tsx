import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionHeader } from '@shared/ui/SectionHeader';
import { usePeopleStore } from '@store/people.store';
import {
  getBirthdayStats,
  getDaysUntilBirthday,
  getCountdownLabel,
  getAgeAtNextBirthday,
  formatBirthdayShort,
  getUpcomingPeople,
  toHomeUpcomingCard,
} from '@features/people/utils/birthday-utils';
import {
  ActionGrid,
  AppHeader,
  BirthdayHeroCard,
  PromoBanner,
  StatCard,
  UpcomingBirthdayCard,
} from '../components';
import { homeMock } from '../data/mock';

export function HomeDashboardScreen() {
  const people = usePeopleStore((s) => s.people);

  const upcomingPeople = useMemo(() => getUpcomingPeople(people, 8), [people]);

  const heroData = useMemo(() => {
    if (upcomingPeople.length === 0) return null;
    const next = upcomingPeople[0];
    const days = getDaysUntilBirthday(next.birthDate);
    const quickActions = homeMock.nextBirthday.quickActions.map((qa) => ({
      ...qa,
      onPress:
        qa.title === 'Create Card'
          ? () =>
              router.push({
                pathname: '/card-studio',
                params: { personId: next.id },
              })
          : undefined,
    }));
    return {
      name: next.fullName,
      age: getAgeAtNextBirthday(next.birthDate),
      dateLabel: formatBirthdayShort(next.birthDate),
      countdown: getCountdownLabel(days),
      friendCount: 0,
      extraFriends: 0,
      quickActions,
    };
  }, [upcomingPeople]);

  const upcomingCards = useMemo(
    () => upcomingPeople.map((p, i) => toHomeUpcomingCard(p, i)),
    [upcomingPeople],
  );

  const stats = useMemo(() => getBirthdayStats(people), [people]);

  const actionGridItems = useMemo(
    () =>
      homeMock.actionGrid.map((item) => ({
        ...item,
        onPress:
          item.id === 'add'
            ? () => router.push('/add-person')
            : item.id === 'create-card'
              ? () => router.push('/card-studio')
              : undefined,
      })),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-2 pb-32"
        showsVerticalScrollIndicator={false}>
        <AppHeader userName={homeMock.user.name} notificationCount={stats.todayCount} />

        {/* Hero Birthday Card */}
        <View className="mb-6">
          {heroData ? (
            <BirthdayHeroCard {...heroData} />
          ) : (
            <View className="bg-primary/10 border border-primary/20 rounded-2xl p-6 items-center">
              <Text className="text-[40px] mb-2">🎂</Text>
              <Text className="text-title font-bold text-foreground text-center">
                No upcoming birthdays
              </Text>
              <Text className="text-caption text-foreground-secondary text-center mt-1">
                Add people to see upcoming birthdays here
              </Text>
            </View>
          )}
        </View>

        <SectionHeader
          title="Upcoming Birthdays"
          actionLabel="View Calendar"
          onActionPress={() => router.push('/(tabs)/calendar')}
        />

        {upcomingCards.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-5"
            contentContainerClassName="pr-2">
            {upcomingCards.map((item) => (
              <UpcomingBirthdayCard key={item.id} {...item} />
            ))}
          </ScrollView>
        ) : (
          <View className="bg-surface border border-border rounded-xl p-4 mb-5 items-center">
            <Text className="text-caption text-foreground-secondary">
              Add people to see upcoming birthdays
            </Text>
          </View>
        )}

        {/* Stats */}
        <View className="flex-row gap-3 mb-5">
          <StatCard
            title="Upcoming (30 days)"
            value={String(stats.upcoming30Count)}
            subtitle="Birthdays coming up"
            icon="bell"
            cardBg="bg-[#FEF9C3]"
            iconBg="bg-amber-200"
            iconColor="#D97706"
            actionBg="bg-amber-300"
            actionColor="#92400E"
          />
          <StatCard
            title="Total People"
            value={String(stats.totalCount)}
            subtitle={stats.todayCount > 0 ? `🎂 ${stats.todayCount} today!` : 'Keep adding more'}
            icon="flame"
            cardBg="bg-[#EDE9FE]"
            iconBg="bg-violet-200"
            iconColor="#7C3AED"
            actionBg="bg-violet-300"
            actionColor="#5B21B6"
          />
        </View>

        <PromoBanner />
        <ActionGrid items={actionGridItems} />
      </ScrollView>
    </SafeAreaView>
  );
}
