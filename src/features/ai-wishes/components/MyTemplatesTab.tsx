import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Bookmark, ClipboardList, Trash2 } from 'lucide-react-native';

import { EmptyState } from '@shared/ui';

import { useAIWishesStore } from '../store/ai-wishes.store';
import type { SavedWishTemplate } from '../types';

export function MyTemplatesTab() {
  const templates = useAIWishesStore((s) => s.savedTemplates);
  const deleteTemplate = useAIWishesStore((s) => s.deleteTemplate);

  const renderItem = ({ item }: { item: SavedWishTemplate }) => {
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
              <Bookmark size={13} color="#7C3AED" fill="#7C3AED" />
              <Text className="text-[12px] font-bold text-foreground">
                {item.name}
              </Text>
            </View>
            <Text className="text-[10px] text-foreground-muted">{dateStr}</Text>
          </View>
          <Text className="text-[12px] text-foreground-secondary leading-5" numberOfLines={3}>
            {item.text}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="px-2 py-0.5 bg-primary/8 rounded-full">
              <Text className="text-[9px] font-semibold text-primary capitalize">
                {item.tone}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row border-t border-gray-50">
          <Pressable
            onPress={() => deleteTemplate(item.id)}
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
      <FlatList
        data={templates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4 pt-3"
        ListEmptyComponent={
          <EmptyState
            icon={ClipboardList}
            title="No saved templates yet"
            subtitle="Save your favorite wish templates for quick reuse"
            className="py-20 px-8"
          />
        }
      />
    </View>
  );
}
