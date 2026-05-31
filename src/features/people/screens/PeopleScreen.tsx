import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePeopleStore } from '@store/people.store';
import {
  getBirthdayStats,
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
import { categories } from '../data/mock';
import type { CategoryId, Contact, SortDirection } from '../types';

function matchCategory(contact: Contact, selectedCategory: CategoryId): boolean {
  if (selectedCategory === 'all') return true;
  if (selectedCategory === 'other')
    return contact.relationship === 'partner' || contact.relationship === 'relative';
  return contact.relationship === selectedCategory;
}

export function PeopleScreen() {
  const people = usePeopleStore((s) => s.people);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const stats = useMemo(() => getBirthdayStats(people), [people]);

  // Derive contacts from store
  const allContacts = useMemo(
    () =>
      people.map(toContact).sort((a, b) => {
        const cmp = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? cmp : -cmp;
      }),
    [people, sortDirection],
  );

  // Upcoming birthdays (sorted by days until)
  const upcomingBirthdayEvents = useMemo(
    () => sortByUpcoming(people).slice(0, 12).map(toBirthdayEvent),
    [people],
  );

  // Live category counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { all: people.length };
    for (const p of people) {
      if (p.relationship === 'friend') counts.friend = (counts.friend ?? 0) + 1;
      else if (p.relationship === 'family') counts.family = (counts.family ?? 0) + 1;
      else if (p.relationship === 'colleague') counts.colleague = (counts.colleague ?? 0) + 1;
      else counts.other = (counts.other ?? 0) + 1;
    }
    return categories.map((c) => ({ ...c, count: counts[c.id] ?? 0 }));
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pt-1 pb-32"
          showsVerticalScrollIndicator={false}>
          <PeopleHeader
            contactCountLabel={`${stats.totalCount} Contacts`}
            onBackPress={() => router.canGoBack() && router.back()}
            onAddPress={() => router.push('/add-person')}
          />

          <SearchBar value={searchText} onChangeText={setSearchText} onFilterPress={() => {}} />

          <CategoryTabs
            categories={categoriesWithCounts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <SortDropdown
            valueLabel="Upcoming Birthdays"
            sortDirection={sortDirection}
            onPressDropdown={() => {}}
            onToggleDirection={() =>
              setSortDirection((value) => (value === 'asc' ? 'desc' : 'asc'))
            }
          />

          <UpcomingBirthdayList items={upcomingBirthdayEvents} totalCount={people.length} />

          <ContactList contacts={filteredContacts} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
