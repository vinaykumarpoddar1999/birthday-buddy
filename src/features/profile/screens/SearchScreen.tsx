import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, CreditCard, Search, SearchX, Settings, Trash2, User, Wand2, X } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@shared/ui/EmptyState';
import { Loader } from '@shared/ui';
import { useDebouncedSearch } from '@features/profile/hooks/useDebouncedSearch';
import { useSearch } from '@features/profile/hooks/useSearch';
import { useActivityStore } from '../store/activity.store';
import type { SearchResult } from '../types';

const SETTINGS_ITEMS = [
  { id: 'personal-info', title: 'Personal Information', subtitle: 'Update your details', route: '/personal-info' },
  { id: 'privacy-security', title: 'Privacy & Security', subtitle: 'Manage access and security', route: '/privacy-security' },
  { id: 'notification-prefs', title: 'Notification Preferences', subtitle: 'Manage notifications', route: '/notification-prefs' },
  { id: 'reminder-settings', title: 'Reminder Settings', subtitle: 'Set reminder timing', route: '/reminder-settings' },
  { id: 'reminder-time', title: 'Reminder Time', subtitle: 'Set default reminder time', route: '/reminder-time' },
  { id: 'backup-restore', title: 'Backup & Restore', subtitle: 'Manage backups', route: '/backup-restore' },
  { id: 'export-data', title: 'Export Data', subtitle: 'Export JSON or CSV', route: '/export-data' },
  { id: 'import-data', title: 'Import Data', subtitle: 'Import JSON backup', route: '/import-data' },
  { id: 'contact-import', title: 'Import Contacts', subtitle: 'Import birthdays from phone', route: '/contact-import' },
  { id: 'calendar-sync', title: 'Calendar Sync', subtitle: 'Sync birthdays to calendar', route: '/calendar-sync' },
  { id: 'privacy-policy', title: 'Privacy Policy', subtitle: 'Data usage and permissions', route: '/privacy-policy' },
  { id: 'terms-conditions', title: 'Terms & Conditions', subtitle: 'User agreement', route: '/terms-conditions' },
  { id: 'help-faq', title: 'Help & FAQ', subtitle: 'Get help', route: '/help-faq' },
];

const SETTINGS_ROUTE_MAP: Record<string, string> = Object.fromEntries(
  SETTINGS_ITEMS.map((s) => [s.id, s.route]),
);

function mapDbResult(
  r: { entityType: string; entityUuid: string; title: string; body: string },
): SearchResult {
  if (r.entityType === 'person') {
    return { id: r.entityUuid, type: 'person', title: r.title, subtitle: r.body };
  }
  if (r.entityType === 'wish') {
    return { id: r.entityUuid, type: 'wish', title: r.title, subtitle: r.body.slice(0, 80) };
  }
  if (r.entityType === 'card') {
    return { id: r.entityUuid, type: 'card', title: r.title, subtitle: 'Saved card' };
  }
  if (r.entityType === 'notification') {
    return { id: r.entityUuid, type: 'event', title: r.title, subtitle: r.body };
  }
  if (r.entityType === 'settings') {
    const route = SETTINGS_ROUTE_MAP[r.entityUuid] ?? SETTINGS_ROUTE_MAP[r.body];
    const item = SETTINGS_ITEMS.find((s) => s.route === route || s.id === r.entityUuid);
    return {
      id: item?.id ?? r.entityUuid,
      type: 'setting',
      title: r.title,
      subtitle: item?.subtitle ?? r.body,
    };
  }
  return { id: r.entityUuid, type: 'person', title: r.title, subtitle: r.body };
}

type SearchCategory = 'all' | 'person' | 'wish' | 'card' | 'setting';

const CATEGORY_CHIPS: { id: SearchCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'person', label: 'People' },
  { id: 'wish', label: 'Wishes' },
  { id: 'card', label: 'Cards' },
  { id: 'setting', label: 'Settings' },
];

const CATEGORY_LABELS: Record<Exclude<SearchCategory, 'all'>, string> = {
  person: 'People',
  wish: 'Wishes',
  card: 'Cards',
  setting: 'Settings',
};

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const debouncedQuery = useDebouncedSearch(query);
  const { data: dbResults = [], isLoading, isFetching } = useSearch(debouncedQuery);
  const isSearching = debouncedQuery.length > 0 && (isLoading || isFetching);
  const recentSearches = useActivityStore((s) => s.recentSearches);
  const addRecentSearch = useActivityStore((s) => s.addRecentSearch);
  const removeRecentSearch = useActivityStore((s) => s.removeRecentSearch);
  const clearRecentSearches = useActivityStore((s) => s.clearRecentSearches);
  const inputRef = useRef<TextInput>(null);

  const results = useMemo((): SearchResult[] => {
    if (!debouncedQuery.trim()) return [];
    const mapped = dbResults.map(mapDbResult);
    SETTINGS_ITEMS.forEach((s) => {
      const q = debouncedQuery.toLowerCase();
      if (s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)) {
        if (!mapped.some((m) => m.id === s.id)) {
          mapped.push({ id: s.id, type: 'setting', title: s.title, subtitle: s.subtitle });
        }
      }
    });
    return mapped;
  }, [debouncedQuery, dbResults]);

  const filteredResults = useMemo(() => {
    if (category === 'all') return results;
    if (category === 'card') {
      return results.filter((r) => r.type === 'card' || r.type === 'event');
    }
    return results.filter((r) => r.type === category);
  }, [results, category]);

  const groupedResults = useMemo(() => {
    if (category !== 'all') return null;
    const groups: Partial<Record<Exclude<SearchCategory, 'all'>, SearchResult[]>> = {};
    for (const result of filteredResults) {
      const key =
        result.type === 'event'
          ? 'card'
          : (result.type as Exclude<SearchCategory, 'all'>);
      if (!groups[key]) groups[key] = [];
      groups[key]!.push(result);
    }
    return groups;
  }, [filteredResults, category]);

  const handleResultPress = (result: SearchResult) => {
    addRecentSearch(query.trim());
    if (result.type === 'setting') {
      const route = SETTINGS_ROUTE_MAP[result.id];
      if (route) router.push(route as never);
      return;
    }
    if (result.type === 'person') {
      router.push({ pathname: '/person-details', params: { personId: result.id } });
      return;
    }
    if (result.type === 'wish') {
      router.push('/ai-wish');
      return;
    }
    if (result.type === 'card') {
      router.push('/card-studio');
      return;
    }
    if (result.type === 'event') {
      router.push({ pathname: '/notification-detail', params: { id: result.id } });
    }
  };

  const resultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'setting':
        return Settings;
      case 'wish':
        return Wand2;
      case 'card':
        return CreditCard;
      case 'event':
        return Calendar;
      default:
        return User;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3 gap-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <View className="flex-1 flex-row items-center bg-surface border border-border rounded-xl px-3 h-11">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            ref={inputRef}
            className="flex-1 ml-2 text-[15px] text-foreground"
            placeholder="Search people, wishes, cards..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} accessibilityRole="button">
              <X size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      <View className="px-5 pb-2">
        <Text className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-2">
          Search by category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {CATEGORY_CHIPS.map((chip) => (
            <Pressable
              key={chip.id}
              onPress={() => setCategory(chip.id)}
              className={`px-3.5 py-2 rounded-full border ${
                category === chip.id ? 'bg-primary border-primary' : 'bg-surface border-border'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: category === chip.id }}>
              <Text
                className={`text-[12px] font-semibold ${
                  category === chip.id ? 'text-white' : 'text-foreground-secondary'
                }`}>
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
        {query.trim() === '' && recentSearches.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[13px] font-semibold text-foreground-secondary">Recent</Text>
              <Pressable onPress={clearRecentSearches}>
                <Text className="text-[12px] text-primary font-semibold">Clear</Text>
              </Pressable>
            </View>
            {recentSearches.map((term) => (
              <Pressable
                key={term}
                onPress={() => setQuery(term)}
                className="flex-row items-center py-2.5 border-b border-border/40">
                <Clock size={16} color="#9CA3AF" />
                <Text className="flex-1 ml-3 text-[14px] text-foreground">{term}</Text>
                <Pressable onPress={() => removeRecentSearch(term)}>
                  <Trash2 size={16} color="#9CA3AF" />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}

        {query.trim() !== '' && debouncedQuery === '' && (
          <View className="py-8 items-center">
            <Loader size="small" />
          </View>
        )}

        {debouncedQuery !== '' && isSearching && (
          <View className="py-8 items-center">
            <Loader size="small" message="Searching..." />
          </View>
        )}

        {debouncedQuery !== '' && !isSearching && filteredResults.length === 0 && (
          <EmptyState icon={SearchX} title="No results" subtitle={`Nothing found for "${debouncedQuery}"`} />
        )}

        {debouncedQuery !== '' && !isSearching && category === 'all' && groupedResults
          ? (Object.keys(groupedResults) as Exclude<SearchCategory, 'all'>[]).map((groupKey) => {
              const items = groupedResults[groupKey];
              if (!items?.length) return null;
              return (
                <View key={groupKey} className="mb-4">
                  <Text className="text-[13px] font-bold text-foreground mb-2">
                    {CATEGORY_LABELS[groupKey]}
                  </Text>
                  {items.map((result) => {
                    const Icon = resultIcon(result.type);
                    return (
                      <Pressable
                        key={`${result.type}-${result.id}`}
                        onPress={() => handleResultPress(result)}
                        className="flex-row items-center py-3.5 border-b border-border/40">
                        <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                          <Icon size={18} color="#7C3AED" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-[15px] font-semibold text-foreground">{result.title}</Text>
                          <Text className="text-[12px] text-foreground-secondary mt-0.5" numberOfLines={2}>
                            {result.subtitle}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              );
            })
          : null}

        {debouncedQuery !== '' && !isSearching && category !== 'all'
          ? filteredResults.map((result) => {
              const Icon = resultIcon(result.type);
              return (
                <Pressable
                  key={`${result.type}-${result.id}`}
                  onPress={() => handleResultPress(result)}
                  className="flex-row items-center py-3.5 border-b border-border/40">
                  <View className="h-10 w-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <Icon size={18} color="#7C3AED" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold text-foreground">{result.title}</Text>
                    <Text className="text-[12px] text-foreground-secondary mt-0.5" numberOfLines={2}>
                      {result.subtitle}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};
