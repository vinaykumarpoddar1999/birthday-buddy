import React, { useCallback, useMemo } from 'react';
import { Dimensions, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Sparkles, WandSparkles, X, Zap } from 'lucide-react-native';

import { EmptyState } from '@shared/ui';

import { useCardStudioStore } from '../store/card-studio.store';
import { useTemplateSearch } from '../hooks/useTemplateSearch';
import type { CardTemplate } from '../types';
import { CategoryPills } from '../components/template/CategoryPills';
import { FilterPanel } from '../components/template/FilterPanel';
import { SavedDraftsSection } from '../components/template/SavedDraftsSection';
import { TemplateCard } from '../components/template/TemplateCard';
import { TrendingSection } from '../components/template/TrendingSection';

const SCREEN_W = Dimensions.get('window').width;
const CARD_GAP = 14;
const CARD_PADDING = 20;
const CARD_W = Math.floor((SCREEN_W - CARD_PADDING * 2 - CARD_GAP) / 2);

export function Step1TemplateScreen() {
  const searchQuery = useCardStudioStore((s) => s.searchQuery);
  const setSearchQuery = useCardStudioStore((s) => s.setSearchQuery);
  const selectTemplate = useCardStudioStore((s) => s.selectTemplate);
  const setEditorMode = useCardStudioStore((s) => s.setEditorMode);
  const selectedCategory = useCardStudioStore((s) => s.selectedCategory);
  const recentTemplateIds = useCardStudioStore((s) => s.recentTemplateIds);
  const favoriteTemplateIds = useCardStudioStore((s) => s.favoriteTemplateIds);

  const { results, trending, allTemplates } = useTemplateSearch();

  const handleSelect = useCallback(
    (template: CardTemplate) => {
      selectTemplate(template);
      setEditorMode('quick');
    },
    [selectTemplate, setEditorMode],
  );

  const showTrending = selectedCategory === 'all' && !searchQuery.trim();

  const recentTemplates = useMemo(
    () => recentTemplateIds.map((id) => allTemplates.find((t) => t.id === id)).filter(Boolean) as CardTemplate[],
    [recentTemplateIds, allTemplates],
  );

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
        <SavedDraftsSection />
        {showTrending && (
          <TrendingSection templates={trending} onSelect={handleSelect} />
        )}
        {recentTemplates.length > 0 && selectedCategory === 'all' && !searchQuery.trim() ? (
          <View className="mb-4">
            <View className="flex-row items-center px-5 mb-2 gap-2">
              <Zap size={14} color="#7C3AED" />
              <Text className="text-[14px] font-bold text-foreground">Recent Designs</Text>
            </View>
            <TrendingSection templates={recentTemplates.slice(0, 6)} onSelect={handleSelect} />
          </View>
        ) : null}
        <View className="flex-row items-center justify-between px-5 mb-3">
          <View>
            <Text className="text-[15px] font-bold text-foreground">All Templates</Text>
            <Text className="text-[10px] text-foreground-muted mt-0.5">
              {results.length} designs · {favoriteTemplateIds.length} favorites
            </Text>
          </View>
        </View>
      </>
    ),
    [showTrending, trending, handleSelect, results.length, recentTemplates, selectedCategory, searchQuery, favoriteTemplateIds.length],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 mb-3">
        <View
          className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-100"
          style={{
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View className="h-8 w-8 rounded-xl bg-primary/10 items-center justify-center mr-3">
            <Search size={16} color="#7C3AED" />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search templates, styles, moods..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-[14px] text-foreground p-0"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search templates"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              className="h-7 w-7 rounded-full bg-gray-100 items-center justify-center ml-2"
              accessibilityRole="button"
              accessibilityLabel="Clear search">
              <X size={13} color="#6B7280" />
            </Pressable>
          )}
        </View>
      </View>

      <CategoryPills />
      <FilterPanel />

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: CARD_PADDING, gap: CARD_GAP }}
        contentContainerStyle={{ paddingBottom: 144 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View className="items-center px-10">
            <EmptyState
              icon={Sparkles}
              title="No templates found"
              subtitle={'Try a different search term or browse\nanother category'}
              className="py-20"
            />
            <Pressable
              onPress={() => setSearchQuery('')}
              className="mt-2 px-6 py-2.5 rounded-full bg-primary/10"
              accessibilityRole="button">
              <Text className="text-[13px] font-semibold text-primary">Clear Filters</Text>
            </Pressable>
          </View>
        }
      />

      <View className="absolute bottom-0 left-0 right-0 px-5 pb-5">
        <View
          className="rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 10,
          }}>
          <LinearGradient colors={['#7C3AED', '#9333EA', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Pressable
              onPress={() => {
                if (results.length > 0) handleSelect(results[0]);
              }}
              className="flex-row items-center justify-between px-5 py-4"
              accessibilityRole="button"
              accessibilityLabel="Quick create with AI-assisted design">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="h-10 w-10 rounded-xl bg-white/15 items-center justify-center mr-3">
                  <WandSparkles size={18} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-bold text-white">Quick Create</Text>
                  <Text className="text-[11px] text-white/70 mt-0.5">
                    Beautiful card in under 60 seconds
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center bg-white/20 rounded-full px-4 py-2.5 gap-1.5 border border-white/20">
                <Sparkles size={13} color="#FFF" />
                <Text className="text-[12px] font-bold text-white">Start</Text>
              </View>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}
