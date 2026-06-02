import { router } from 'expo-router';
import { ArrowLeft, Heart, Search, Sparkles } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@shared/ui/EmptyState';
import { useWishHistory } from '@features/ai-wishes/hooks/useWishHistory';

const FILTERS = ['All', 'Favorites', 'Recent'] as const;
type FilterType = (typeof FILTERS)[number];

export const WishHistoryScreen = () => {
  const { history, toggleFavorite } = useWishHistory();
  const favorites = useMemo(() => history.filter((w) => w.isFavorite), [history]);
  const [filter, setFilter] = useState<FilterType>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let items = filter === 'Favorites' ? favorites : filter === 'Recent' ? history.slice(0, 10) : history;
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((w) => w.text?.toLowerCase().includes(q) || w.personName?.toLowerCase().includes(q));
    }
    return items;
  }, [history, favorites, filter, query]);

  const nowMs = useMemo(() => Date.now(), []);

  const getRelativeTime = (ts: string) => {
    const diff = nowMs - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Wish History</Text>
      </View>

      {/* Search */}
      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-3">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search wishes..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 py-2.5 px-2 text-[15px] text-foreground"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row flex-wrap gap-2 px-5 mb-3">
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1 border ${filter === f ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
            accessibilityRole="button">
            <Text className={`text-[11px] font-semibold ${filter === f ? 'text-white' : 'text-foreground-secondary'}`}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No wishes yet"
            subtitle="Generate AI wishes for your contacts and they will appear here"
            className="pt-8"
          />
        ) : (
          filtered.map((wish) => (
            <View key={wish.id} className="bg-surface rounded-xl px-3 py-2 mb-1 border border-border/60 min-h-[52px]">
              <View className="flex-row items-start">
                <View className="flex-1 min-w-0">
                  <Text className="text-[13px] text-foreground leading-5" numberOfLines={2}>{wish.text}</Text>
                  <View className="flex-row items-center gap-2 mt-1.5 flex-wrap">
                    {wish.tone && (
                      <View className="bg-primary/10 rounded-full px-2 py-0.5">
                        <Text className="text-[10px] font-bold text-primary capitalize">{wish.tone}</Text>
                      </View>
                    )}
                    {wish.personName && <Text className="text-[10px] text-foreground-secondary">for {wish.personName}</Text>}
                    <Text className="text-[10px] text-foreground-secondary/60">{getRelativeTime(wish.createdAt)}</Text>
                  </View>
                </View>
                <Pressable onPress={() => toggleFavorite(wish.id, !wish.isFavorite)} className="ml-2 p-1" accessibilityRole="button" accessibilityLabel="Toggle favorite">
                  <Heart size={16} color={wish.isFavorite ? '#EF4444' : '#9CA3AF'} fill={wish.isFavorite ? '#EF4444' : 'transparent'} />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
