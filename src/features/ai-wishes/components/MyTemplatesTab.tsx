import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Bookmark, Calendar, ClipboardList, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { EmptyState } from '@shared/ui';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { SavedWishTemplate } from '../types';

export function MyTemplatesTab() {
  const templates = useAIWishesStore((s) => s.savedTemplates);
  const deleteTemplate = useAIWishesStore((s) => s.deleteTemplate);

  const renderItem = ({ item, index }: { item: SavedWishTemplate; index: number }) => {
    const date = new Date(item.createdAt);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(300)}
        className="mx-5 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}>
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-2.5">
            <View className="flex-row items-center gap-2">
              <View className="h-6 w-6 rounded-lg bg-primary/10 items-center justify-center">
                <Bookmark size={12} color="#7C3AED" fill="#7C3AED" />
              </View>
              <Text className="text-[13px] font-bold text-foreground">
                {item.name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={10} color="#9CA3AF" />
              <Text className="text-[10px] text-foreground-muted">{dateStr}</Text>
            </View>
          </View>
          <Text className="text-[13px] text-foreground-secondary leading-5" numberOfLines={3}>
            {item.text}
          </Text>
          <View className="flex-row items-center mt-2.5 gap-2">
            <View className="px-2.5 py-1 bg-primary/10 rounded-full">
              <Text className="text-[9px] font-bold text-primary capitalize">
                {item.tone}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row border-t border-gray-50">
          <Pressable
            onPress={() => deleteTemplate(item.id)}
            className="flex-1 flex-row items-center justify-center py-2.5 gap-1.5 active:bg-red-50"
            accessibilityRole="button"
            accessibilityLabel="Remove template">
            <Trash2 size={14} color="#EF4444" />
            <Text className="text-[11px] font-semibold text-red-500">Remove</Text>
          </Pressable>
        </View>
      </Animated.View>
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
