import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  Unlock,
} from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardElement } from '../../types';

export function ElementActionBar({ element }: { element: CardElement }) {
  const deleteElement = useCardStudioStore((s) => s.deleteElement);
  const duplicateElement = useCardStudioStore((s) => s.duplicateElement);
  const bringForward = useCardStudioStore((s) => s.bringForward);
  const sendBackward = useCardStudioStore((s) => s.sendBackward);
  const toggleElementLock = useCardStudioStore((s) => s.toggleElementLock);
  const toggleElementVisibility = useCardStudioStore((s) => s.toggleElementVisibility);
  const selectElement = useCardStudioStore((s) => s.selectElement);

  const ToolBtn = ({
    icon: Icon,
    label,
    onPress,
    danger,
  }: {
    icon: React.ComponentType<{ size: number; color: string }>;
    label: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      className="items-center px-3 py-2 rounded-xl bg-white border border-gray-100 min-w-[52px]"
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Icon size={16} color={danger ? '#DC2626' : '#7C3AED'} />
      <Text className={`text-[9px] font-semibold mt-1 ${danger ? 'text-red-600' : 'text-foreground-secondary'}`}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="px-4 mb-2">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[12px] font-bold text-foreground capitalize">
          {element.type} · Layer {element.zIndex}
        </Text>
        <Pressable onPress={() => selectElement(null)} accessibilityRole="button">
          <Text className="text-[11px] text-primary font-semibold">Done</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <ToolBtn icon={Copy} label="Duplicate" onPress={() => duplicateElement(element.id)} />
        <ToolBtn icon={ArrowUp} label="Forward" onPress={() => bringForward(element.id)} />
        <ToolBtn icon={ArrowDown} label="Back" onPress={() => sendBackward(element.id)} />
        <ToolBtn
          icon={element.locked ? Unlock : Lock}
          label={element.locked ? 'Unlock' : 'Lock'}
          onPress={() => toggleElementLock(element.id)}
        />
        <ToolBtn
          icon={element.visible ? EyeOff : Eye}
          label={element.visible ? 'Hide' : 'Show'}
          onPress={() => toggleElementVisibility(element.id)}
        />
        <ToolBtn icon={Trash2} label="Delete" danger onPress={() => deleteElement(element.id)} />
      </ScrollView>
    </View>
  );
}
