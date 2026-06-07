import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@shared/ui/EmptyState';

import { FAQ_DATA } from '../utils/faq-data';

const CATEGORIES = [
  'All',
  'Getting Started',
  'Birthdays',
  'Notifications',
  'Calendar',
  'Contacts',
  'Wishes',
  'Cards',
  'Data',
  'Privacy',
  'Account',
  'Support',
];

export const HelpFAQScreen = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = FAQ_DATA;
    if (category !== 'All') {
      items = items.filter((f) => f.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
      );
    }
    return items;
  }, [query, category]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Help & FAQ</Text>
      </View>

      <View className="px-5 mb-2">
        <View className="flex-row items-center bg-surface rounded-xl px-3">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search FAQs..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 py-2.5 px-2 text-[15px] text-foreground"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5 mb-2"
        contentContainerClassName="gap-2">
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 ${category === c ? 'bg-primary' : 'bg-surface'}`}
            accessibilityRole="button">
            <Text
              className={`text-[12px] font-semibold ${category === c ? 'text-white' : 'text-foreground-secondary'}`}>
              {c}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No FAQs found"
            subtitle="Try a different search term"
            className="pt-8"
          />
        ) : (
          filtered.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <Pressable
                key={faq.id}
                onPress={() => setExpandedId(isExpanded ? null : faq.id)}
                className="bg-surface rounded-xl px-4 py-3 mb-2"
                accessibilityRole="button">
                <View className="flex-row items-center">
                  <View className="flex-1 pr-2">
                    <Text className="text-[14px] font-semibold text-foreground">{faq.question}</Text>
                    <Text className="text-[10px] text-primary font-medium mt-0.5">{faq.category}</Text>
                  </View>
                  {isExpanded ? <ChevronUp size={18} color="#9CA3AF" /> : <ChevronDown size={18} color="#9CA3AF" />}
                </View>
                {isExpanded ? (
                  <View className="mt-2 pt-2 border-t border-border/40">
                    <Text className="text-[13px] text-foreground-secondary leading-5">{faq.answer}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
