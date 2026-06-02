import React, { useCallback, useRef } from 'react';
import { Dimensions, FlatList, View } from 'react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardTemplate } from '../../types';
import { TemplateCard } from './TemplateCard';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = Math.floor(SCREEN_W * 0.72);
const CARD_GAP = 14;
const SIDE_PAD = (SCREEN_W - CARD_W) / 2;

type Props = {
  templates: CardTemplate[];
  onSelect: (template: CardTemplate) => void;
};

export function TemplateCarousel({ templates, onSelect }: Props) {
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
      <View style={{ width: CARD_W, marginRight: CARD_GAP }}>
        <TemplateCard
          template={item}
          onSelect={handleSelect}
          width={CARD_W}
          selected={selectedId === item.id}
        />
      </View>
    ),
    [handleSelect, selectedId],
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
      snapToInterval={CARD_W + CARD_GAP}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: SIDE_PAD, paddingVertical: 8 }}
      onMomentumScrollEnd={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + CARD_GAP));
        const item = templates[Math.min(index, templates.length - 1)];
        if (item) setPreviewId(item.id);
      }}
    />
  );
}
