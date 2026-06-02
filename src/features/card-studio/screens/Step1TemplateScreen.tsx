import React, { useCallback } from 'react';
import { FlatList, Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Search, Sparkles, X } from 'lucide-react-native';

import { EmptyState } from '@shared/ui';

import { useCardStudioStore } from '../store/card-studio.store';
import { useTemplateSearch } from '../hooks/useTemplateSearch';
import type { CardTemplate } from '../types';
import { CategoryPills } from '../components/template/CategoryPills';
import { TemplateCard } from '../components/template/TemplateCard';
import { TemplateCarousel } from '../components/template/TemplateCarousel';

const CARD_GAP = 14;
const CARD_PADDING = 20;

export function Step1TemplateScreen() {
  const { width: screenW } = useWindowDimensions();
  const gridCardW = Math.floor((screenW - CARD_PADDING * 2 - CARD_GAP) / 2);
  const searchQuery = useCardStudioStore((s) => s.searchQuery);
  const setSearchQuery = useCardStudioStore((s) => s.setSearchQuery);
  const selectTemplate = useCardStudioStore((s) => s.selectTemplate);
  const setPreviewId = useCardStudioStore((s) => s.setSelectedTemplatePreviewId);

  const { results, isLoading } = useTemplateSearch();

  const handleSelect = useCallback(
    (template: CardTemplate) => {
      setPreviewId(template.id);
      selectTemplate(template);
    },
    [selectTemplate, setPreviewId],
  );

  const renderGridItem = useCallback(
    ({ item }: { item: CardTemplate }) => (
      <TemplateCard template={item} onSelect={handleSelect} width={gridCardW} />
    ),
    [handleSelect, gridCardW],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 mb-3">
        <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 border border-border">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search templates..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-[15px] text-foreground"
            accessibilityLabel="Search templates"
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search">
              <X size={18} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <CategoryPills />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: CARD_PADDING, gap: CARD_GAP }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {results.length > 0 ? (
              <View className="mb-2">
                <View className="flex-row items-center px-5 mb-1 gap-2">
                  <Sparkles size={14} color="#7C3AED" />
                  <Text className="text-[14px] font-bold text-foreground">Featured</Text>
                </View>
                <TemplateCarousel templates={results} onSelect={handleSelect} />
                <View className="px-5 mt-2 mb-3">
                  <Text className="text-[13px] font-semibold text-foreground-secondary">
                    All templates · {results.length}
                  </Text>
                </View>
              </View>
            ) : null}
          </>
        }
        renderItem={renderGridItem}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="No templates found"
              subtitle="Try a different search or category."
              icon={Sparkles}
            />
          ) : null
        }
      />
    </View>
  );
}
