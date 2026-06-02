import React, { useCallback } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Bookmark, Calendar, ClipboardList, Sparkles, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { feedback } from '@/shared/feedback';
import { EmptyState } from '@shared/ui';
import { useAIWishesStore } from '../store/ai-wishes.store';
import type { SavedWishTemplate } from '../types';
import { WishColors, WishShadows } from '../constants/design-tokens';

export function MyTemplatesTab() {
  const templates = useAIWishesStore((s) => s.savedTemplates);
  const deleteTemplate = useAIWishesStore((s) => s.deleteTemplate);
  const setActiveTab = useAIWishesStore((s) => s.setActiveTab);
  const setTone = useAIWishesStore((s) => s.setTone);
  const setPersonalContext = useAIWishesStore((s) => s.setPersonalContext);

  const handleUseTemplate = useCallback(
    (item: SavedWishTemplate) => {
      setTone(item.tone);
      setPersonalContext(item.text.slice(0, 150));
      setActiveTab('generate');
      feedback.success('Template applied', 'Tone and text loaded — tap Generate to create a fresh wish.');
    },
    [setActiveTab, setPersonalContext, setTone],
  );

  const renderItem = ({ item, index }: { item: SavedWishTemplate; index: number }) => {
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
              <View className="h-7 w-7 rounded-lg bg-primary/10 items-center justify-center">
                <Bookmark size={13} color={WishColors.primary} fill={WishColors.primary} />
              </View>
              <Text className="text-[14px] font-extrabold text-foreground flex-1" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Calendar size={10} color={WishColors.foregroundMuted} />
              <Text className="text-[10px] text-foreground-muted">{dateStr}</Text>
            </View>
          </View>
          <Text className="text-[13px] text-foreground-secondary leading-5" numberOfLines={3}>
            {item.text}
          </Text>
          <View className="flex-row items-center mt-2.5">
            <View className="px-2.5 py-1 bg-primary/10 rounded-full">
              <Text className="text-[9px] font-bold text-primary capitalize">
                {item.tone.replace('-', ' ')}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row border-t border-border/60">
          <Pressable
            onPress={() => handleUseTemplate(item)}
            className="flex-1 flex-row items-center justify-center py-3 gap-1.5 active:bg-primary/5"
            accessibilityRole="button"
            accessibilityLabel="Use this template">
            <Sparkles size={14} color={WishColors.primary} />
            <Text className="text-[11px] font-bold text-primary">Use</Text>
          </Pressable>
          <View className="w-px bg-border/60" />
          <Pressable
            onPress={() => deleteTemplate(item.id)}
            className="flex-1 flex-row items-center justify-center py-3 gap-1.5 active:bg-red-50"
            accessibilityRole="button"
            accessibilityLabel="Remove template">
            <Trash2 size={14} color={WishColors.error} />
            <Text className="text-[11px] font-bold text-red-500">Remove</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <Animated.View entering={FadeInDown.duration(300)} className="px-5 pt-3 pb-1">
        <Text className="text-[18px] font-extrabold text-foreground">Saved Templates</Text>
        <Text className="text-[12px] text-foreground-muted mt-0.5">
          Reuse your best wishes with one tap
        </Text>
      </Animated.View>

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
            subtitle="Tap Save on a generated wish to store it here for quick reuse"
            className="py-20 px-8"
          />
        }
      />
    </View>
  );
}
