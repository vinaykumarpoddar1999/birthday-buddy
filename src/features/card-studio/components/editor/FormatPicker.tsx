import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { RectangleHorizontal, RectangleVertical, Square } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CanvasFormat } from '../../types';

const FORMATS: { id: CanvasFormat; label: string; Icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'portrait', label: 'Portrait', Icon: RectangleVertical },
  { id: 'landscape', label: 'Landscape', Icon: RectangleHorizontal },
  { id: 'square', label: 'Square', Icon: Square },
];

export function FormatPicker() {
  const canvasFormat = useCardStudioStore((s) => s.canvasFormat);
  const setCanvasFormat = useCardStudioStore((s) => s.setCanvasFormat);

  return (
    <View className="flex-row gap-2 px-4 mb-2">
      {FORMATS.map(({ id, label, Icon }) => {
        const active = canvasFormat === id;
        return (
          <Pressable
            key={id}
            onPress={() => setCanvasFormat(id)}
            className={`flex-1 flex-row items-center justify-center py-2 rounded-xl gap-1.5 border ${active ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
            accessibilityRole="button"
            accessibilityLabel={`${label} format${active ? ', selected' : ''}`}>
            <Icon size={14} color={active ? '#7C3AED' : '#9CA3AF'} />
            <Text className={`text-[10px] font-bold ${active ? 'text-primary' : 'text-foreground-muted'}`}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
