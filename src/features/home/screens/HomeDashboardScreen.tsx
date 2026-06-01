import { router } from 'expo-router';
import { Cake, UserPlus } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, PageSkeleton } from '@shared/ui';
import { SectionHeader } from '@shared/ui/SectionHeader';
import { feedback } from '@/shared/feedback';
import { toHomeUpcomingCard } from '@features/people/utils/birthday-utils';
import { useUpcomingPeople, useBirthdayStats, usePersonMutations } from '@features/people/hooks/usePeople';
import { importContactsFromDevice } from '@/services/contacts/contacts-import.service';
import {
  ActionGrid,
  AppHeader,
  HomeFab,
  PromoBanner,
  StatCard,
  UpcomingBirthdayBanner,
  UpcomingBirthdayCard,
} from '../components';
import { HOME_ACTION_GRID } from '@/constants/home';
import { useProfileStore } from '@features/profile/store/profile.store';

export function HomeDashboardScreen() {
  const {
    data: upcomingPeople = [],
    isLoading,
    isError,
    refetch,
  } = useUpcomingPeople(8);
  const { data: stats, isLoading: statsLoading } = useBirthdayStats();
  const { invalidate } = usePersonMutations();
  const userName = useProfileStore((s) => s.profile.fullName) || 'there';
  const [importingContacts, setImportingContacts] = useState(false);

  const upcomingCards = useMemo(
    () => upcomingPeople.map((p, i) => toHomeUpcomingCard(p, i)),
    [upcomingPeople],
  );

  const statsData = stats ?? { todayCount: 0, upcoming30Count: 0, totalCount: 0 };

  const handleImportContacts = useCallback(async () => {
    if (importingContacts) return;
    setImportingContacts(true);
    try {
      const result = await importContactsFromDevice();
      await invalidate();
      await refetch();
      if (result.imported === 0) {
        feedback.warning(
          'No New Contacts',
          result.skipped > 0
            ? 'Contacts without birthdays or already in your list were skipped.'
            : 'No contacts with birthdays were found on this device.',
        );
      } else {
        feedback.success(
          'Contacts Imported',
          `Added ${result.imported} people${result.skipped > 0 ? ` · ${result.skipped} skipped` : ''}.`,
        );
      }
    } catch (error) {
      feedback.error(
        'Import Failed',
        error instanceof Error ? error.message : 'Could not import contacts.',
      );
    } finally {
      setImportingContacts(false);
    }
  }, [importingContacts, invalidate, refetch]);

  const actionGridItems = useMemo(
    () =>
      HOME_ACTION_GRID.map((item) => ({
        ...item,
        onPress:
          item.id === 'create-card'
            ? () => router.push('/card-studio')
            : item.id === 'group'
              ? () => router.push('/(tabs)/contacts')
              : item.id === 'import-contacts'
                ? () => void handleImportContacts()
                : item.id === 'ai-wish'
                  ? () => router.push('/ai-wish')
                  : undefined,
      })),
    [handleImportContacts],
  );

  if (isLoading || statsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <PageSkeleton />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="px-5 pt-2">
          <AppHeader userName={userName} />
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-2 pb-32"
        showsVerticalScrollIndicator={false}>
        <AppHeader userName={userName} />

        {upcomingPeople.length > 0 ? (
          <UpcomingBirthdayBanner people={upcomingPeople} />
        ) : (
          <View className="mb-6">
            <EmptyState
              icon={Cake}
              title="No upcoming birthdays"
              subtitle="Add people to see upcoming celebrations and live countdowns here."
              primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
              secondaryAction={{ label: 'Import Contacts', onPress: () => void handleImportContacts() }}
              className="bg-primary/10 border border-primary/20 rounded-2xl"
            />
          </View>
        )}

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
          <EmptyState
            icon={UserPlus}
            title="No birthdays yet"
            subtitle="Your upcoming birthday cards will appear here."
            className="bg-surface border border-border rounded-xl mb-5 py-6"
          />
        )}

        <View className="flex-row gap-3 mb-5">
          <StatCard
            title="Upcoming (30 days)"
            value={String(statsData.upcoming30Count)}
            subtitle="Birthdays coming up"
            icon="bell"
            gradientColors={['#F59E0B', '#EA580C']}
            onPress={() => router.push('/(tabs)/calendar')}
          />
          <StatCard
            title="Total People"
            value={String(statsData.totalCount)}
            subtitle={
              statsData.todayCount > 0
                ? `${statsData.todayCount} birthday${statsData.todayCount === 1 ? '' : 's'} today`
                : 'Keep adding more'
            }
            icon="flame"
            gradientColors={['#8B5CF6', '#6D28D9']}
            onPress={() => router.push('/(tabs)/contacts')}
          />
        </View>

        <PromoBanner />
        <ActionGrid items={actionGridItems} />
      </ScrollView>
      <HomeFab />
    </SafeAreaView>
  );
}
