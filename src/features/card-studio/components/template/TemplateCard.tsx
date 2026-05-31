import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Crown, Heart } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardTemplate } from '../../types';
import { TemplateThumbnail } from './TemplateThumbnail';

type Props = {
  template: CardTemplate;
  onSelect: (template: CardTemplate) => void;
  width?: number;
};

export const TemplateCard = memo(function TemplateCard({
  template,
  onSelect,
  width = 155,
}: Props) {
  const isFav = useCardStudioStore((s) => s.favoriteTemplateIds.includes(template.id));
  const toggleFav = useCardStudioStore((s) => s.toggleFavorite);

  const handleFav = useCallback(
    () => toggleFav(template.id),
    [toggleFav, template.id],
  );

  return (
    <Pressable
      onPress={() => onSelect(template)}
      className="mb-4"
      accessibilityRole="button"
      accessibilityLabel={`Select ${template.name}`}>
      <View
        style={{ width }}
        className="rounded-2xl overflow-hidden bg-white shadow-card border border-gray-100">
        <View className="relative">
          <TemplateThumbnail template={template} width={width} />

          {template.isPremium && (
            <View className="absolute top-2.5 left-2.5 flex-row items-center bg-amber-400 rounded-full px-2 py-1 gap-1">
              <Crown size={10} color="#78350F" />
              <Text className="text-[8px] font-bold text-amber-900">PRO</Text>
            </View>
          )}

          <Pressable
            onPress={handleFav}
            className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/90 items-center justify-center shadow-sm"
            accessibilityRole="button"
            accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart
              size={15}
              color={isFav ? '#EF4444' : '#9CA3AF'}
              fill={isFav ? '#EF4444' : 'none'}
            />
          </Pressable>
        </View>

        <View className="px-3 py-2.5">
          <Text className="text-[12px] font-bold text-foreground" numberOfLines={1}>
            {template.name}
          </Text>
          <Text className="text-[10px] text-foreground-muted mt-0.5 capitalize" numberOfLines={1}>
            {template.category} · {template.isPremium ? 'Premium' : 'Free'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
