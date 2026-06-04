import React, { useCallback } from 'react';
import { FlatList, Platform, Text, useWindowDimensions, View } from 'react-native';

import { EmptyState } from '@shared/ui';
import { Sparkles } from 'lucide-react-native';

import { ShimmerOverlay } from '@/shared/motion/ShimmerOverlay';

import { useCardStudioStore } from '../store/card-studio.store';
import { useTemplateSearch } from '../hooks/useTemplateSearch';
import type { CardTemplate } from '../types';
import { CategoryPills } from '../components/template/CategoryPills';
import { TemplateCard } from '../components/template/TemplateCard';

const CARD_GAP = 12;
const CARD_PADDING = 20;

function TemplateGridSkeleton({ cardW }: { cardW: number }) {
  const thumbH = Math.round(cardW * (5 / 4));
  return (
    <View className="flex-row flex-wrap px-5 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          className="rounded-2xl overflow-hidden bg-gray-200/80"
          style={{ width: cardW, height: thumbH }}>
          <ShimmerOverlay borderRadius={16} />
        </View>
      ))}
    </View>
  );
}

export function Step1TemplateScreen() {
  const { width: screenW } = useWindowDimensions();
  const gridCardW = Math.floor((screenW - CARD_PADDING * 2 - CARD_GAP) / 2);
  const selectTemplate = useCardStudioStore((s) => s.selectTemplate);
  const setPreviewId = useCardStudioStore((s) => s.setSelectedTemplatePreviewId);
  const selectedId = useCardStudioStore((s) => s.selectedTemplatePreviewId);
  const selectedCategory = useCardStudioStore((s) => s.selectedCategory);

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
      <TemplateCard
        template={item}
        onSelect={handleSelect}
        width={gridCardW}
        selected={selectedId === item.id}
      />
    ),
    [handleSelect, gridCardW, selectedId],
  );

  const categoryLabel =
    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  return (
    <View className="flex-1 bg-background">
      <CategoryPills />

      <View className="px-5 pt-3 pb-2">
        <Text className="text-[15px] font-bold text-foreground">Templates</Text>
        <Text className="text-caption text-foreground-muted mt-0.5">
          {categoryLabel} · Tap a card to personalize
        </Text>
      </View>

      {isLoading ? (
        <TemplateGridSkeleton cardW={gridCardW} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={{ flex: 1 }}
          columnWrapperStyle={{
            paddingHorizontal: CARD_PADDING,
            gap: CARD_GAP,
            marginBottom: CARD_GAP,
          }}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          removeClippedSubviews={Platform.OS === 'android'}
          renderItem={renderGridItem}
          ListEmptyComponent={
            <EmptyState
              title="No templates in this category"
              subtitle="Try another filter above."
              icon={Sparkles}
            />
          }
        />
      )}
    </View>
  );
}
