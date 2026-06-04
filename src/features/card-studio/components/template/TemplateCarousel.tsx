import React, { useCallback, useRef } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardTemplate } from '../../types';
import { TemplateCard } from './TemplateCard';

const CARD_WIDTH_RATIO = 0.39;
const CARD_GAP = 12;

type Props = {
  templates: CardTemplate[];
  onSelect: (template: CardTemplate) => void;
};

export function TemplateCarousel({ templates, onSelect }: Props) {
  const { width: screenW } = useWindowDimensions();
  const cardW = Math.floor(screenW * CARD_WIDTH_RATIO);
  const sidePad = Math.max(20, (screenW - cardW) / 2);
  const snapInterval = cardW + CARD_GAP;

  const selectedId = useCardStudioStore((s) => s.selectedTemplatePreviewId);
  const setPreviewId = useCardStudioStore((s) => s.setSelectedTemplatePreviewId);
  const listRef = useRef<FlatList<CardTemplate>>(null);

  const handleSelect = useCallback(
    (template: CardTemplate) => {
      setPreviewId(template.id);
      onSelect(template);
    },
    [onSelect, setPreviewId],
  );

  const renderItem = useCallback(
    ({ item }: { item: CardTemplate }) => (
      <View style={{ width: cardW, marginRight: CARD_GAP }}>
        <TemplateCard
          template={item}
          onSelect={handleSelect}
          width={cardW}
          selected={selectedId === item.id}
        />
      </View>
    ),
    [handleSelect, selectedId, cardW],
  );

  if (templates.length === 0) return null;

  return (
    <FlatList
      ref={listRef}
      data={templates}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      snapToInterval={snapInterval}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: sidePad, paddingVertical: 4 }}
      onMomentumScrollEnd={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / snapInterval);
        const item = templates[Math.min(index, templates.length - 1)];
        if (item) setPreviewId(item.id);
      }}
    />
  );
}
