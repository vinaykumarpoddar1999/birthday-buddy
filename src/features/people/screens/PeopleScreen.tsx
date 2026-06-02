import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, ErrorState, ListSkeleton } from '@shared/ui';
import { usePeople } from '@features/people/hooks/usePeople';
import { feedback } from '@/shared/feedback';
import {
  sortByUpcoming,
  toBirthdayEvent,
  toContact,
} from '@features/people/utils/birthday-utils';
import { CategoryTabs } from '../components/CategoryTabs';
import { ContactList } from '../components/ContactList';
import { PeopleHeader } from '../components/PeopleHeader';
import { SearchBar } from '../components/SearchBar';
import { SortDropdown } from '../components/SortDropdown';
import { UpcomingBirthdayList } from '../components/UpcomingBirthdayList';
import { PEOPLE_CATEGORIES } from '@/constants/people-categories';
import { QuickAddModal } from '@shared/navigation/QuickAddModal';
import { openSelectFromContact } from '@shared/navigation/quick-add-actions';
import type { CategoryId, Contact, SortDirection } from '../types';

function matchCategory(contact: Contact, selectedCategory: CategoryId): boolean {
  if (selectedCategory === 'all') return true;
  if (selectedCategory === 'other')
    return contact.relationship === 'partner' || contact.relationship === 'relative';
  return contact.relationship === selectedCategory;
}

export function PeopleScreen() {
  const { data: people = [], isLoading, isError, refetch } = usePeople();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterActive, setFilterActive] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleImportContacts = () => {
    router.push('/contact-import');
  };

  const allContacts = useMemo(
    () =>
      people.map(toContact).sort((a, b) => {
        const cmp = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? cmp : -cmp;
      }),
    [people, sortDirection],
  );

  const upcomingBirthdayEvents = useMemo(
    () => sortByUpcoming(people).slice(0, 12).map(toBirthdayEvent),
    [people],
  );

  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { all: people.length };
    for (const p of people) {
      if (p.relationship === 'friend') counts.friend = (counts.friend ?? 0) + 1;
      else if (p.relationship === 'family') counts.family = (counts.family ?? 0) + 1;
      else if (p.relationship === 'colleague') counts.colleague = (counts.colleague ?? 0) + 1;
      else counts.other = (counts.other ?? 0) + 1;
    }
    return PEOPLE_CATEGORIES.map((c) => ({ ...c, count: counts[c.id] ?? 0 }));
  }, [people]);

  const filteredContacts = useMemo(() => {
    const lower = searchText.trim().toLowerCase();
    return allContacts.filter((contact) => {
      const categoryMatch = matchCategory(contact, selectedCategory);
      const searchMatch =
        lower.length === 0 ||
        contact.name.toLowerCase().includes(lower) ||
        contact.phone.toLowerCase().includes(lower) ||
        contact.email.toLowerCase().includes(lower);
      return categoryMatch && searchMatch;
    });
  }, [allContacts, searchText, selectedCategory]);

  const handleFilterPress = () => {
    if (filterActive) {
      setSelectedCategory('all');
      setSearchText('');
      setFilterActive(false);
    } else {
      setFilterActive(true);
      feedback.actionSheet({
        title: 'Filter Options',
        options: [
          { label: 'Friends Only', onPress: () => setSelectedCategory('friend') },
          { label: 'Family Only', onPress: () => setSelectedCategory('family') },
          { label: 'All People', onPress: () => setSelectedCategory('all') },
        ],
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <ListSkeleton rows={8} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <ErrorState kind="database" onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-2 pb-32"
          showsVerticalScrollIndicator={false}>
          <PeopleHeader onAddPress={() => setShowAddMenu(true)} />

          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            onFilterPress={handleFilterPress}
            filterActive={filterActive}
          />

          <CategoryTabs
            categories={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {people.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No people yet"
              subtitle="Add friends and family to track birthdays, send wishes, and create cards."
              primaryAction={{ label: 'Add Person', onPress: () => router.push('/add-person') }}
              secondaryAction={{
                label: 'Import Contacts',
                onPress: handleImportContacts,
              }}
              className="mt-4 bg-surface border border-border rounded-2xl"
            />
          ) : (
            <>
              {selectedCategory === 'all' && !searchText.trim() && (
                <UpcomingBirthdayList items={upcomingBirthdayEvents} />
              )}

              <SortDropdown
                sortDirection={sortDirection}
                onToggleDirection={() => setSortDirection((v) => (v === 'asc' ? 'desc' : 'asc'))}
                resultCount={filteredContacts.length}
              />

              {filteredContacts.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No matches found"
                  subtitle="Try a different search or filter to find people."
                  primaryAction={{
                    label: 'Clear Filters',
                    onPress: () => {
                      setSearchText('');
                      setSelectedCategory('all');
                      setFilterActive(false);
                    },
                  }}
                  className="py-6"
                />
              ) : (
                <ContactList contacts={filteredContacts} />
              )}
            </>
          )}
        </ScrollView>
      </View>

      <QuickAddModal
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onAddManually={() => {
          setShowAddMenu(false);
          router.push('/add-person');
        }}
        onSelectFromContact={() => {
          setShowAddMenu(false);
          void openSelectFromContact();
        }}
      />
    </SafeAreaView>
  );
}
