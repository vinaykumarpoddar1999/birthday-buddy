import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import { TEXT_COLORS } from '../../utils/background-presets';

export function TextColorPicker() {
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const elements = useCardStudioStore((s) => s.elements);
  const updateElement = useCardStudioStore((s) => s.updateElement);
  const pushHistory = useCardStudioStore((s) => s.pushHistory);

  const selected = elements.find((el) => el.id === selectedElementId);
  if (!selected || selected.type !== 'text') {
    return (
      <View className="px-4 pb-3">
        <Text className="text-[12px] text-foreground-muted">
          Select a text element on the canvas to change its color.
        </Text>
      </View>
    );
  }

  return (
    <View className="px-4 pb-3">
      <Text className="text-[12px] text-foreground-muted mb-2">Text color</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TEXT_COLORS.map((color) => (
          <Pressable
            key={color}
            onPress={() => {
              updateElement(selected.id, { color });
              pushHistory();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Text color ${color}`}
            accessibilityState={{ selected: selected.color === color }}>
            <View
              className="h-10 w-10 rounded-xl border-2"
              style={{
                backgroundColor: color,
                borderColor: selected.color === color ? '#7C3AED' : '#E5E7EB',
              }}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
