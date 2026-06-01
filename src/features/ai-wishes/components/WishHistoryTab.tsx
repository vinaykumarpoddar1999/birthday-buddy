import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Heart, ScrollText, Search, Trash2, X } from 'lucide-react-native';

import { EmptyState } from '@shared/ui';

import { useWishHistory } from '../hooks/useWishHistory';
import type { WishHistoryEntry } from '../types';

export function WishHistoryTab() {
  const { history, toggleFavorite, deleteFromHistory } = useWishHistory();

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

  const renderItem = ({ item }: { item: WishHistoryEntry }) => {
    const date = new Date(item.createdAt);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <View
        className="mx-5 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}>
        <View className="p-3.5">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-[12px] font-bold text-foreground">
                {item.personName}
              </Text>
              <View className="px-2 py-0.5 bg-primary/8 rounded-full">
                <Text className="text-[9px] font-semibold text-primary capitalize">
                  {item.tone}
                </Text>
              </View>
            </View>
            <Text className="text-[10px] text-foreground-muted">{dateStr}</Text>
          </View>
          <Text className="text-[12px] text-foreground-secondary leading-5" numberOfLines={3}>
            {item.text}
          </Text>
        </View>
        <View className="flex-row border-t border-gray-50">
          <Pressable
            onPress={() => toggleFavorite(item.id, !item.isFavorite)}
            className="flex-1 flex-row items-center justify-center py-2.5 gap-1"
            accessibilityRole="button">
            <Heart
              size={13}
              color={item.isFavorite ? '#EF4444' : '#9CA3AF'}
              fill={item.isFavorite ? '#EF4444' : 'none'}
            />
            <Text className="text-[10px] font-semibold text-foreground-muted">
              {item.isFavorite ? 'Favorited' : 'Favorite'}
            </Text>
          </Pressable>
          <View className="w-[1px] bg-gray-50" />
          <Pressable
            onPress={() => deleteFromHistory(item.id)}
            className="flex-1 flex-row items-center justify-center py-2.5 gap-1"
            accessibilityRole="button">
            <Trash2 size={13} color="#EF4444" />
            <Text className="text-[10px] font-semibold text-red-500">Remove</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Search + filter */}
      <View className="flex-row items-center gap-2.5 px-5 py-3">
        <View
          className="flex-1 flex-row items-center bg-white rounded-xl px-3 py-2.5 border border-gray-100"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 3,
            elevation: 1,
          }}>
          <Search size={15} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search wishes..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-[13px] text-foreground ml-2 p-0"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} accessibilityRole="button">
              <X size={14} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setFilterFav(!filterFav)}
          className={`h-10 w-10 rounded-xl items-center justify-center border ${
            filterFav ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
          }`}
          accessibilityRole="button"
          accessibilityLabel="Filter favorites">
          <Heart
            size={17}
            color={filterFav ? '#EF4444' : '#9CA3AF'}
            fill={filterFav ? '#EF4444' : 'none'}
          />
        </Pressable>
      </View>

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
