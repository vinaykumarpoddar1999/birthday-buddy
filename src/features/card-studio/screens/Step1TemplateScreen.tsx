import React, { useCallback, useMemo } from 'react';
import { Dimensions, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Sparkles } from 'lucide-react-native';

import { useCardStudioStore } from '../store/card-studio.store';
import { useTemplateSearch } from '../hooks/useTemplateSearch';
import type { CardTemplate } from '../types';
import { CategoryPills } from '../components/template/CategoryPills';
import { TemplateCard } from '../components/template/TemplateCard';
import { TrendingSection } from '../components/template/TrendingSection';

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = 12;
const CARD_PADDING = 20;
const CARD_W = Math.floor((SCREEN_W - CARD_PADDING * 2 - CARD_GAP) / 2);

export function Step1TemplateScreen() {
  const searchQuery = useCardStudioStore((s) => s.searchQuery);
  const setSearchQuery = useCardStudioStore((s) => s.setSearchQuery);
  const selectTemplate = useCardStudioStore((s) => s.selectTemplate);
  const selectedCategory = useCardStudioStore((s) => s.selectedCategory);

  const { results, trending } = useTemplateSearch();

  const handleSelect = useCallback(
    (template: CardTemplate) => {
      selectTemplate(template);
    },
    [selectTemplate],
  );

  const showTrending = selectedCategory === 'all' && !searchQuery.trim();

  const renderItem = useCallback(
    ({ item }: { item: CardTemplate }) => (
      <TemplateCard template={item} onSelect={handleSelect} width={CARD_W} />
    ),
    [handleSelect],
  );

  const keyExtractor = useCallback((item: CardTemplate) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <>
        {showTrending && (
          <TrendingSection templates={trending} onSelect={handleSelect} />
        )}
        <View className="px-5 mb-3">
          <Text className="text-body font-bold text-foreground">All Templates</Text>
        </View>
      </>
    ),
    [showTrending, trending, handleSelect],
  );

  return (
    <View className="flex-1 bg-background">
      {/* Search */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search templates..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-body text-foreground ml-3 p-0"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Categories */}
      <View className="mb-4">
        <CategoryPills />
      </View>

      {/* Template grid */}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: CARD_PADDING, gap: CARD_GAP }}
        contentContainerClassName="pb-40"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View className="items-center py-16 px-8">
            <Text className="text-[48px] mb-4">🔍</Text>
            <Text className="text-title font-bold text-foreground text-center">
              No templates found
            </Text>
            <Text className="text-caption text-foreground-secondary text-center mt-2">
              Try a different search or category
            </Text>
          </View>
        }
      />

      {/* AI Banner */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-5">
        <View className="rounded-2xl overflow-hidden shadow-lg">
          <LinearGradient
            colors={['#7C3AED', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Pressable
              onPress={() => {
                if (results.length > 0) handleSelect(results[0]);
              }}
              className="flex-row items-center justify-between px-5 py-4"
              accessibilityRole="button">
              <View className="flex-1 mr-3">
                <Text className="text-[14px] font-bold text-white">
                  Want something unique?
                </Text>
                <Text className="text-[11px] text-white/80 mt-0.5">
                  Use AI to generate your perfect card
                </Text>
              </View>
              <View className="flex-row items-center bg-white/20 rounded-full px-4 py-2.5 gap-1.5">
                <Sparkles size={14} color="#FFF" />
                <Text className="text-[11px] font-bold text-white">Generate</Text>
              </View>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}
