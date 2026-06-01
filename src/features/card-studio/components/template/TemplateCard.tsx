import React, { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Crown, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      accessibilityLabel={`Select ${template.name}`}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}>
      <View
        style={{
          width,
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
        className="rounded-2xl overflow-hidden bg-white border border-gray-100/80">
        <View className="relative">
          <TemplateThumbnail template={template} width={width} />

          {template.isPremium && (
            <View className="absolute top-2.5 left-2.5 overflow-hidden rounded-full">
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View className="flex-row items-center px-2.5 py-1 gap-1">
                  <Crown size={9} color="#FFF" fill="#FFF" />
                  <Text className="text-[8px] font-extrabold text-white tracking-wider">PRO</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          <Pressable
            onPress={handleFav}
            className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full items-center justify-center"
            style={{
              backgroundColor: isFav ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.92)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            accessibilityRole="button"
            accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart
              size={15}
              color={isFav ? '#EF4444' : '#9CA3AF'}
              fill={isFav ? '#EF4444' : 'none'}
            />
          </Pressable>

          <View className="absolute bottom-0 left-0 right-0">
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}>
              <View className="px-3 pt-6 pb-2.5">
                <Text className="text-[12px] font-bold text-white" numberOfLines={1}>
                  {template.name}
                </Text>
                <Text className="text-[9px] text-white/70 mt-0.5 capitalize" numberOfLines={1}>
                  {template.category} · {template.isPremium ? 'Premium' : 'Free'}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Pressable>
  );
});
