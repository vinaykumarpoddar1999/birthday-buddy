import { router } from 'expo-router';
import { Cake, UserPlus } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, PageSkeleton } from '@shared/ui';
import { useUpcomingPeople, useHomeInsights } from '@features/people/hooks/usePeople';
import { HomeHeader } from '../components/HomeHeader';
import { HeroBirthdayCard } from '../components/HeroBirthdayCard';
import { HeroActionPanel } from '../components/HeroActionPanel';
import { UpcomingBirthdaySection } from '../components/UpcomingBirthdaySection';
import { StatsSection } from '../components/StatsSection';
import { SpecialCardsBanner } from '../components/SpecialCardsBanner';
import { QuickActionsGrid } from '../components/QuickActionsGrid';
import { Colors, scale } from '../constants/design-tokens';

export function HomeDashboardScreen() {
  const {
    data: upcomingPeople = [],
    isLoading,
    isError,
    refetch,
  } = useUpcomingPeople(8);
  const { data: homeInsights } = useHomeInsights();

  const listPeople = useMemo(() => upcomingPeople.slice(1, 5), [upcomingPeople]);

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
            <HeroBirthdayCard person={upcomingPeople[0]} />
            <HeroActionPanel />
          </View>
        ) : (
          <View style={styles.emptyHero}>
            <EmptyState
              icon={Cake}
              title="No upcoming birthdays"
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
            title="No birthdays yet"
            subtitle="Your upcoming birthday cards will appear here."
          />
        )}

        {/* Stats Section */}
        <StatsSection
          remindersToday={homeInsights?.remindersToday ?? 0}
          streakDays={homeInsights?.streakDays ?? 2}
          upcomingThisWeek={homeInsights?.upcomingThisWeek ?? 0}
        />

        {/* Special Cards Banner */}
        <SpecialCardsBanner />

        {/* Quick Actions Grid */}
        <QuickActionsGrid />

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingBottom: scale(120),
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
  bottomSpacer: {
    height: scale(40),
  },
});
