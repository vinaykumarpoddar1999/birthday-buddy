import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  Cake,
  Flower2,
  Heart,
  Palette,
  PartyPopper,
  Star,
  Sticker,
  type LucideIcon,
} from 'lucide-react-native';

import { getLucideIcon } from '@shared/utils/lucide-icons';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardElement } from '../../types';

type StickerCategory = { id: string; label: string; Icon: LucideIcon };

const STICKER_CATEGORIES: StickerCategory[] = [
  { id: 'popular', label: 'Popular', Icon: Star },
  { id: 'celebration', label: 'Celebrate', Icon: PartyPopper },
  { id: 'love', label: 'Love', Icon: Heart },
  { id: 'nature', label: 'Nature', Icon: Flower2 },
  { id: 'food', label: 'Food', Icon: Cake },
  { id: 'fun', label: 'Fun', Icon: Palette },
];

const STICKERS_BY_CATEGORY: Record<string, string[]> = {
  popular: ['balloon', 'cake', 'gift', 'party-popper', 'party-popper', 'sparkles', 'heart', 'star', 'party-popper', 'gift', 'crown', 'sparkles'],
  celebration: ['balloon', 'party-popper', 'party-popper', 'party-popper', 'music', 'sparkles', 'sparkles', 'sparkles', 'wine', 'wine', 'party-popper', 'zap'],
  love: ['heart', 'heart', 'heart', 'heart', 'gift', 'heart', 'heart', 'heart', 'heart', 'users', 'heart', 'sparkles'],
  nature: ['flower', 'flower2', 'flower', 'flower2', 'flower2', 'flower', 'flower', 'leaf', 'leaf', 'sparkles', 'sparkles', 'rainbow'],
  food: ['cake', 'cake', 'cake', 'candy', 'candy', 'candy', 'candy', 'candy', 'sparkles', 'cake', 'sparkles', 'candy'],
  fun: ['party-popper', 'sparkles', 'palette', 'mic', 'music', 'target', 'gamepad', 'trophy', 'gamepad', 'baby', 'sparkles', 'sparkles'],
};

export function DecorationPicker() {
  const addElement = useCardStudioStore((s) => s.addElement);
  const elements = useCardStudioStore((s) => s.elements);
  const [activeCategory, setActiveCategory] = useState('popular');

  const handleAdd = useCallback(
    (iconKey: string) => {
      const maxZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) : 0;
      const el: CardElement = {
        id: `stk-${Date.now()}`,
        type: 'sticker',
        content: `icon:${iconKey}`,
        x: 130 + Math.random() * 60,
        y: 200 + Math.random() * 60,
        width: 50,
        height: 50,
        rotation: 0,
        opacity: 1,
        zIndex: maxZ + 1,
        visible: true,
        fontSize: 36,
      };
      addElement(el);
    },
    [addElement, elements],
  );

  const stickers = STICKERS_BY_CATEGORY[activeCategory] || STICKERS_BY_CATEGORY.popular;

  return (
    <View
      className="mx-5 mb-4 bg-white rounded-2xl overflow-hidden border border-gray-100"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
        <View className="h-7 w-7 rounded-lg bg-primary/10 items-center justify-center mr-2.5">
          <Sticker size={14} color="#7C3AED" />
        </View>
        <View className="flex-1">
          <Text className="text-[14px] font-bold text-foreground">Stickers & Decorations</Text>
          <Text className="text-[10px] text-foreground-muted mt-0.5">Tap to add to your card</Text>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 6 }}
        className="border-b border-gray-50">
        {STICKER_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const { Icon } = cat;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              className={`flex-row items-center px-3 py-1.5 rounded-lg gap-1 ${
                isActive ? 'bg-primary/10' : 'bg-transparent'
              }`}
              accessibilityRole="button">
              <Icon size={12} color={isActive ? '#7C3AED' : '#9CA3AF'} strokeWidth={2} />
              <Text className={`text-[11px] font-semibold ${isActive ? 'text-primary' : 'text-foreground-muted'}`}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Sticker Grid */}
      <View className="flex-row flex-wrap px-3 py-3 gap-2">
        {stickers.map((iconKey, i) => {
          const StickerIcon = getLucideIcon(iconKey);
          if (!StickerIcon) return null;
          return (
            <Pressable
              key={`${iconKey}-${i}`}
              onPress={() => handleAdd(iconKey)}
              className="h-12 w-12 rounded-xl bg-gray-50 items-center justify-center border border-gray-100/50"
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.88 : 1 }],
              })}
              accessibilityRole="button"
              accessibilityLabel={`Add ${iconKey} sticker`}>
              <StickerIcon size={26} color="#7C3AED" strokeWidth={1.75} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
