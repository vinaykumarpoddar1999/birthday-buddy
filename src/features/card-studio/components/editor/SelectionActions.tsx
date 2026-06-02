import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';

export function SelectionActions() {
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const deleteElement = useCardStudioStore((s) => s.deleteElement);
  const selectElement = useCardStudioStore((s) => s.selectElement);

  if (!selectedElementId) return null;

  return (
    <View className="absolute top-2 right-2 z-[2000]">
      <Pressable
        onPress={() => {
          deleteElement(selectedElementId);
          selectElement(null);
        }}
        className="flex-row items-center gap-1.5 px-3 py-2 rounded-full bg-red-500"
        accessibilityRole="button"
        accessibilityLabel="Delete selected element">
        <Trash2 size={14} color="#FFF" />
        <Text className="text-[11px] font-bold text-white">Delete</Text>
      </Pressable>
    </View>
  );
}
