import { router } from 'expo-router';
import { ArrowLeft, Download, Heart, Palette, Share2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { EmptyState } from '@shared/ui/EmptyState';
import { cardService } from '@/services/card/card.service';

const FILTERS = ['All', 'Favorites', 'With Export'] as const;
type FilterType = (typeof FILTERS)[number];

function parseCardTitle(cardJson: string): string {
  try {
    const parsed = JSON.parse(cardJson) as { personalization?: { recipientName?: string } };
    return parsed.personalization?.recipientName ?? 'Birthday Card';
  } catch {
    return 'Birthday Card';
  }
}

export const CardHistoryScreen = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const [query, setQuery] = useState('');

  const { data: cards = [] } = useQuery({
    queryKey: ['card-history'],
    queryFn: () => cardService.listSaved(100),
  });

  const filtered = useMemo(() => {
    let items = cards;
    if (filter === 'Favorites') items = items.filter((c) => c.favorite);
    if (filter === 'With Export') items = items.filter((c) => c.exportUri);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((c) => parseCardTitle(c.cardJson).toLowerCase().includes(q));
    }
    return items;
  }, [cards, filter, query]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Card History</Text>
      </View>

      <View className="px-5 mb-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search cards..."
          placeholderTextColor="#9CA3AF"
          className="bg-surface border border-border rounded-xl px-4 py-2.5 text-[15px] text-foreground"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-3" contentContainerClassName="gap-2">
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 border ${filter === f ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
            accessibilityRole="button">
            <Text className={`text-[12px] font-semibold ${filter === f ? 'text-white' : 'text-foreground-secondary'}`}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState icon={Palette} title="No cards yet" subtitle="Create cards in Card Studio" className="pt-12" />
        ) : (
          filtered.map((card) => (
            <View key={card.id} className="bg-surface rounded-xl p-3.5 mb-2 border border-border/60 flex-row items-center">
              <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
                <Palette size={18} color="#7C3AED" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-semibold text-foreground">{parseCardTitle(card.cardJson)}</Text>
                <Text className="text-[11px] text-foreground-secondary mt-0.5">
                  {new Date(card.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-row gap-2">
                {card.favorite && <Heart size={14} color="#EC4899" fill="#EC4899" />}
                {card.exportUri && <Download size={14} color="#9CA3AF" />}
                {card.exportUri && <Share2 size={14} color="#22C55E" />}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
