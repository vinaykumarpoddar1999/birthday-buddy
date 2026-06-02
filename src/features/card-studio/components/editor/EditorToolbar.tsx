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

export function EditorToolbar() {
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const elements = useCardStudioStore((s) => s.elements);
  const deleteElement = useCardStudioStore((s) => s.deleteElement);
  const duplicateElement = useCardStudioStore((s) => s.duplicateElement);
  const bringForward = useCardStudioStore((s) => s.bringForward);
  const sendBackward = useCardStudioStore((s) => s.sendBackward);
  const toggleElementLock = useCardStudioStore((s) => s.toggleElementLock);
  const toggleElementVisibility = useCardStudioStore((s) => s.toggleElementVisibility);
  const selectElement = useCardStudioStore((s) => s.selectElement);

  const selected = elements.find((el) => el.id === selectedElementId);

  if (!selected) {
    return (
      <View className="mx-5 mb-3 px-4 py-3 rounded-2xl bg-surface border border-border">
        <Text className="text-[12px] text-foreground-muted text-center">
          Tap an element on the canvas to move, resize, or rotate it
        </Text>
      </View>
    );
  }

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
      className="items-center px-3 py-2 rounded-xl bg-background border border-border min-w-[56px]"
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Icon size={16} color={danger ? '#DC2626' : '#7C3AED'} />
      <Text className={`text-[9px] font-semibold mt-1 ${danger ? 'text-red-600' : 'text-foreground-secondary'}`}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="mx-5 mb-3">
      <View className="flex-row items-center justify-between mb-2 px-1">
        <Text className="text-[12px] font-bold text-foreground capitalize">
          {selected.type} selected
          {selected.locked ? ' · Locked' : ''}
        </Text>
        <Pressable onPress={() => selectElement(null)}>
          <Text className="text-[11px] text-primary font-semibold">Deselect</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <ToolBtn icon={Copy} label="Duplicate" onPress={() => duplicateElement(selected.id)} />
        <ToolBtn icon={ArrowUp} label="Forward" onPress={() => bringForward(selected.id)} />
        <ToolBtn icon={ArrowDown} label="Backward" onPress={() => sendBackward(selected.id)} />
        <ToolBtn
          icon={selected.locked ? Unlock : Lock}
          label={selected.locked ? 'Unlock' : 'Lock'}
          onPress={() => toggleElementLock(selected.id)}
        />
        <ToolBtn
          icon={selected.visible ? EyeOff : Eye}
          label={selected.visible ? 'Hide' : 'Show'}
          onPress={() => toggleElementVisibility(selected.id)}
        />
        <ToolBtn
          icon={Trash2}
          label="Delete"
          danger
          onPress={() => deleteElement(selected.id)}
        />
      </ScrollView>
    </View>
  );
}
