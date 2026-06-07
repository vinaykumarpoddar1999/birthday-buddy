import { ConfettiBurst } from '@/shared/ui/ConfettiBurst';
import { router } from 'expo-router';
import { Cake, UserPlus } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBirthdayConfetti } from '../hooks/useBirthdayConfetti';

import { useHomeInsights, useUpcomingPeople } from '@features/people/hooks/usePeople';
import { EmptyState, PageSkeleton } from '@shared/ui';
import { HeroActionPanel } from '../components/HeroActionPanel';
import { HeroBirthdayCard } from '../components/HeroBirthdayCard';
import { HomeHeader } from '../components/HomeHeader';
import { MadeWithLoveFooter } from '../components/MadeWithLoveFooter';
import { NotificationPermissionModal } from '../components/NotificationPermissionModal';
import { QuickActionsGrid } from '../components/QuickActionsGrid';
import { SpecialCardsBanner } from '../components/SpecialCardsBanner';
import { StatsSection } from '../components/StatsSection';
import { UpcomingBirthdaySection } from '../components/UpcomingBirthdaySection';
import { Colors, scale } from '../constants/design-tokens';

export function HomeDashboardScreen() {
  const {
    data: upcomingPeople = [],
    isLoading,
    isError,
    refetch,
  } = useUpcomingPeople(10);
  const { data: homeInsights } = useHomeInsights();

  const listPeople = useMemo(() => upcomingPeople.slice(0, 10), [upcomingPeople]);
  const heroPerson = upcomingPeople[0];
  const { showConfetti } = useBirthdayConfetti(heroPerson?.id, heroPerson?.birthDate);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <PageSkeleton />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.errorContainer}>
          <HomeHeader />
        </View>
        <EmptyState
          icon={Cake}
          title="Could not load birthdays"
          subtitle="Your data is stored offline. Tap retry to reload from SQLite."
          primaryAction={{ label: 'Retry', onPress: () => void refetch() }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled>
        {/* Header */}
        <HomeHeader />

        {/* Hero Birthday Card */}
        {upcomingPeople.length > 0 ? (
          <View style={styles.heroWrapper}>
            {showConfetti ? <ConfettiBurst active durationMs={8000} count={120} /> : null}
            <HeroBirthdayCard person={upcomingPeople[0]} />
            <HeroActionPanel />
          </View>
        ) : (
          <View style={styles.emptyHero}>
            <EmptyState
              icon={Cake}
              title="No upcoming birthdays/events"
              subtitle="Add people to see upcoming celebrations and live countdowns here."
              primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
            />
          </View>
        )}

        {/* Upcoming Birthdays Section */}
        {listPeople.length > 0 ? (
          <UpcomingBirthdaySection people={listPeople} />
        ) : (
          <EmptyState
            icon={UserPlus}
            title="No birthdays/events yet"
            subtitle="Your upcoming birthday/event cards will appear here."
          />
        )}

        {/* Stats Section */}
        <StatsSection
          birthdaysThisMonth={homeInsights?.birthdaysThisMonth ?? 0}
          streakDays={homeInsights?.streakDays ?? 0}
          upcomingThisWeek={homeInsights?.upcomingThisWeek ?? 0}
        />

        {/* Special Cards Banner */}
        <SpecialCardsBanner />

        {/* Quick Actions Grid */}
        <QuickActionsGrid />

        <MadeWithLoveFooter />
      </ScrollView>
      <NotificationPermissionModal active />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: scale(8),
    paddingBottom: scale(88),
  },
  errorContainer: {
    paddingHorizontal: scale(20),
    paddingTop: scale(8),
  },
  heroWrapper: {
    marginBottom: scale(8),
  },
  emptyHero: {
    marginBottom: scale(16),
  },
});
