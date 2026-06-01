import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Search, SearchX, Settings, Trash2, User, X } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@shared/ui/EmptyState';

import { usePeopleStore } from '@store/people.store';
import { useActivityStore } from '../store/activity.store';
import type { SearchResult } from '../types';

const SETTINGS_ITEMS = [
  { id: 's-1', title: 'Personal Information', subtitle: 'Update your details', route: '/personal-info' },
  { id: 's-2', title: 'Privacy & Security', subtitle: 'Manage access and security', route: '/privacy-security' },
  { id: 's-3', title: 'Notification Preferences', subtitle: 'Manage notifications', route: '/notification-prefs' },
  { id: 's-4', title: 'Reminder Time', subtitle: 'Set default reminder time', route: '/reminder-time' },
  { id: 's-5', title: 'Theme', subtitle: 'Change app appearance', route: '/theme-select' },
  { id: 's-6', title: 'Language', subtitle: 'Change app language', route: '/language-select' },
  { id: 's-7', title: 'Backup & Restore', subtitle: 'Manage backups', route: '/backup-restore' },
  { id: 's-8', title: 'Help & FAQ', subtitle: 'Get help', route: '/help-faq' },
];

export const SearchScreen = () => {
  const people = usePeopleStore((s) => s.people);
  const recentSearches = useActivityStore((s) => s.recentSearches);
  const addRecentSearch = useActivityStore((s) => s.addRecentSearch);
  const removeRecentSearch = useActivityStore((s) => s.removeRecentSearch);
  const clearRecentSearches = useActivityStore((s) => s.clearRecentSearches);
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const r: SearchResult[] = [];

    people.forEach((p) => {
      if (p.fullName.toLowerCase().includes(q) || p.nickname?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.phone?.includes(q)) {
        r.push({ id: p.id, type: 'person', title: p.fullName, subtitle: `${p.relationship} · ${p.birthDate}` });
      }
    });

    SETTINGS_ITEMS.forEach((s) => {
      if (s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)) {
        r.push({ id: s.id, type: 'setting', title: s.title, subtitle: s.subtitle });
      }
    });

    return r;
  }, [query, people]);

  const handleResultPress = (result: SearchResult) => {
    addRecentSearch(query.trim());
    if (result.type === 'setting') {
      const item = SETTINGS_ITEMS.find((s) => s.id === result.id);
      if (item) router.push(item.route as never);
    }
  };

  const iconForType = (type: SearchResult['type']) => {
    const map = { person: User, event: Calendar, wish: Search, card: Search, setting: Settings };
    return map[type];
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3 gap-3">
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <ArrowLeft size={22} color="#111827" />
        </Pressable>
        <View className="flex-1 flex-row items-center bg-surface border border-border rounded-xl px-3">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search people, settings..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 py-2.5 px-2 text-[15px] text-foreground"
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => { if (query.trim()) addRecentSearch(query.trim()); }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} accessibilityRole="button">
              <X size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {query.trim() === '' ? (
          <>
            {recentSearches.length > 0 && (
              <View className="mt-2">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase">Recent Searches</Text>
                  <Pressable onPress={clearRecentSearches} accessibilityRole="button">
                    <Text className="text-[11px] font-bold text-primary">Clear All</Text>
                  </Pressable>
                </View>
                {recentSearches.map((s) => (
                  <Pressable
                    key={s}
                    className="flex-row items-center py-2.5"
                    onPress={() => setQuery(s)}
                    accessibilityRole="button">
                    <Clock size={16} color="#9CA3AF" />
                    <Text className="text-[14px] text-foreground ml-3 flex-1">{s}</Text>
                    <Pressable onPress={() => removeRecentSearch(s)} accessibilityRole="button" accessibilityLabel={`Remove ${s}`}>
                      <Trash2 size={14} color="#9CA3AF" />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            )}
            <EmptyState
              icon={Search}
              title="Search"
              subtitle="Search people, events, and settings"
              className="pt-8"
            />
          </>
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No results found"
            subtitle="Try a different search term"
            className="pt-8"
          />
        ) : (
          <>
            <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mt-2 mb-2">{results.length} Results</Text>
            {results.map((r) => {
              const Icon = iconForType(r.type);
              return (
                <Pressable
                  key={r.id}
                  className="flex-row items-center py-3 bg-surface rounded-xl px-3 mb-2 border border-border/60"
                  onPress={() => handleResultPress(r)}
                  accessibilityRole="button">
                  <View className="h-9 w-9 rounded-xl items-center justify-center mr-3 bg-primary/10">
                    <Icon size={18} color="#7C3AED" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[14px] font-medium text-foreground">{r.title}</Text>
                    <Text className="text-[12px] text-foreground-secondary mt-0.5">{r.subtitle}</Text>
                  </View>
                  <View className="bg-border/40 rounded-full px-2 py-0.5">
                    <Text className="text-[10px] text-foreground-secondary capitalize">{r.type}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
