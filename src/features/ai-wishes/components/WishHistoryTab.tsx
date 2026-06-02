import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Calendar, Heart, ScrollText, Search, Sparkles, Trash2, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { feedback } from '@/shared/feedback';
import { EmptyState } from '@shared/ui';
import { useWishHistory } from '../hooks/useWishHistory';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { WishHistoryEntry } from '../types';
import { WishColors, WishShadows } from '../constants/design-tokens';

export function WishHistoryTab() {
  const { history, toggleFavorite, deleteFromHistory } = useWishHistory();
  const setActiveTab = useAIWishesStore((s) => s.setActiveTab);
  const setSelectedPersonId = useAIWishesStore((s) => s.setSelectedPersonId);
  const setTone = useAIWishesStore((s) => s.setTone);
  const setLength = useAIWishesStore((s) => s.setLength);
  const setLanguage = useAIWishesStore((s) => s.setLanguage);
  const setPersonalContext = useAIWishesStore((s) => s.setPersonalContext);
  const setCurrentWish = useAIWishesStore((s) => s.setCurrentWish);

  const [search, setSearch] = useState('');
  const [filterFav, setFilterFav] = useState(false);

  const filtered = useMemo(() => {
    let items = history;
    if (filterFav) items = items.filter((w) => w.isFavorite);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (w) =>
          w.text.toLowerCase().includes(q) ||
          w.personName.toLowerCase().includes(q) ||
          w.tone.toLowerCase().includes(q),
      );
    }
    return items;
  }, [history, search, filterFav]);

  const handleUseWish = useCallback(
    (item: WishHistoryEntry) => {
      setSelectedPersonId(item.personId);
      setTone(item.tone);
      setLength(item.length);
      setLanguage(item.language);
      setPersonalContext(item.personalContext);
      setCurrentWish(item);
      setActiveTab('generate');
      feedback.success('Wish loaded', 'Scroll up to view, edit, or share this wish.');
    },
    [
      setActiveTab,
      setCurrentWish,
      setLanguage,
      setLength,
      setPersonalContext,
      setSelectedPersonId,
      setTone,
    ],
  );

  const renderItem = ({ item, index }: { item: WishHistoryEntry; index: number }) => {
    const date = new Date(item.createdAt);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(300)}
        className="mx-5 mb-3 bg-surface rounded-2xl border border-border/80 overflow-hidden"
        style={WishShadows.sm}>
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center gap-2 flex-1">
              <Text className="text-[14px] font-extrabold text-foreground" numberOfLines={1}>
                {item.personName}
              </Text>
              <View className="px-2 py-0.5 bg-primary/10 rounded-full">
                <Text className="text-[9px] font-bold text-primary capitalize">
                  {item.tone.replace('-', ' ')}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={10} color={WishColors.foregroundMuted} />
              <Text className="text-[10px] text-foreground-muted">{dateStr}</Text>
            </View>
          </View>
          <Text className="text-[13px] text-foreground-secondary leading-5" numberOfLines={3}>
            {item.text}
          </Text>
        </View>

        <View className="flex-row border-t border-border/60">
          <Pressable
            onPress={() => handleUseWish(item)}
            className="flex-1 flex-row items-center justify-center py-3 gap-1.5 active:bg-primary/5"
            accessibilityRole="button"
            accessibilityLabel="Use this wish">
            <Sparkles size={14} color={WishColors.primary} />
            <Text className="text-[11px] font-bold text-primary">Use</Text>
          </Pressable>
          <View className="w-px bg-border/60" />
          <Pressable
            onPress={() => toggleFavorite(item.id, !item.isFavorite)}
            className="flex-1 flex-row items-center justify-center py-3 gap-1.5 active:bg-gray-50"
            accessibilityRole="button"
            accessibilityLabel={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart
              size={14}
              color={item.isFavorite ? WishColors.error : WishColors.foregroundMuted}
              fill={item.isFavorite ? WishColors.error : 'none'}
            />
            <Text
              className={`text-[11px] font-bold ${
                item.isFavorite ? 'text-red-500' : 'text-foreground-muted'
              }`}>
              {item.isFavorite ? 'Saved' : 'Favorite'}
            </Text>
          </Pressable>
          <View className="w-px bg-border/60" />
          <Pressable
            onPress={() => deleteFromHistory(item.id)}
            className="flex-1 flex-row items-center justify-center py-3 gap-1.5 active:bg-red-50"
            accessibilityRole="button"
            accessibilityLabel="Remove from history">
            <Trash2 size={14} color={WishColors.error} />
            <Text className="text-[11px] font-bold text-red-500">Remove</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <Animated.View entering={FadeInDown.duration(300)} className="px-5 pt-3 pb-2">
        <Text className="text-[18px] font-extrabold text-foreground">Wish History</Text>
        <Text className="text-[12px] text-foreground-muted mt-0.5">
          Reuse, favorite, or remove past wishes
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(300)}
        className="flex-row items-center gap-2.5 px-5 py-3">
        <View
          className="flex-1 flex-row items-center bg-surface rounded-xl px-3 py-2.5 border border-border/80"
          style={WishShadows.sm}>
          <Search size={16} color={WishColors.foregroundMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search wishes..."
            placeholderTextColor={WishColors.foregroundMuted}
            className="flex-1 text-[13px] text-foreground ml-2 p-0"
            accessibilityLabel="Search wish history"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} accessibilityRole="button" accessibilityLabel="Clear search">
              <X size={14} color={WishColors.foregroundMuted} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setFilterFav(!filterFav)}
          className={`h-11 w-11 rounded-xl items-center justify-center border ${
            filterFav ? 'bg-red-50 border-red-200' : 'bg-surface border-border/80'
          }`}
          style={WishShadows.sm}
          accessibilityRole="button"
          accessibilityLabel="Filter favorites"
          accessibilityState={{ selected: filterFav }}>
          <Heart
            size={17}
            color={filterFav ? WishColors.error : WishColors.foregroundMuted}
            fill={filterFav ? WishColors.error : 'none'}
          />
        </Pressable>
      </Animated.View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
        ListEmptyComponent={
          <EmptyState
            icon={ScrollText}
            title={filterFav ? 'No favorite wishes yet' : 'No wish history yet'}
            subtitle={
              filterFav
                ? 'Heart your favorite wishes to save them here'
                : 'Generate your first AI wish and it will appear here'
            }
            className="py-20 px-8"
          />
        }
      />
    </View>
  );
}
