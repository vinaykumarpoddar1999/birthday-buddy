import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import type { CardTemplate } from '../../types';
import { TemplateCard } from './TemplateCard';

type Props = {
  templates: CardTemplate[];
  onSelect: (template: CardTemplate) => void;
};

export function TrendingSection({ templates, onSelect }: Props) {
  if (templates.length === 0) return null;

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between px-5 mb-3">
        <Text className="text-body font-bold text-foreground">Trending Now 🔥</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-3">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} onSelect={onSelect} width={155} />
        ))}
      </ScrollView>
    </View>
  );
}
