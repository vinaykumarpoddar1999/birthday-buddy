import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardElement } from '../../types';

const STICKERS = [
  '🎈', '🎂', '🧁', '🎁', '🎀', '🎉', '🎊', '✨',
  '💖', '❤️', '💕', '🌸', '🌹', '💐', '🌷', '⭐',
  '🌟', '💫', '🥳', '🎵', '🕯️', '👑', '🦋', '🍰',
];

export function DecorationPicker() {
  const addElement = useCardStudioStore((s) => s.addElement);
  const elements = useCardStudioStore((s) => s.elements);

  const handleAdd = useCallback(
    (emoji: string) => {
      const maxZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) : 0;
      const el: CardElement = {
        id: `stk-${Date.now()}`,
        type: 'sticker',
        content: emoji,
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

  return (
    <View className="mx-5 mb-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <View className="px-4 py-3 border-b border-gray-50">
        <Text className="text-[13px] font-bold text-foreground">Add Stickers</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-3 py-3 gap-2">
        {STICKERS.map((emoji, i) => (
          <Pressable
            key={`${emoji}-${i}`}
            onPress={() => handleAdd(emoji)}
            className="h-11 w-11 rounded-xl bg-gray-50 items-center justify-center"
            accessibilityRole="button">
            <Text style={{ fontSize: 24 }}>{emoji}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
