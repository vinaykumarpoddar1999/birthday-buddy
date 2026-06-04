import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Minus, Plus, Type } from 'lucide-react-native';

import { CardStudioSectionTitle } from '../common/CardStudioSectionTitle';
import { studioTokens } from '../../constants/studio-tokens';
import { useCardEditor } from '../../hooks/useCardEditor';
import { useCardStudioStore } from '../../store/card-studio.store';
import { TEXT_COLORS } from '../../utils/background-presets';

const FONT_WEIGHTS = [
  { label: 'Regular', value: '400' as const },
  { label: 'Bold', value: '700' as const },
];

export function TextColorPicker() {
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const elements = useCardStudioStore((s) => s.elements);
  const updateElement = useCardStudioStore((s) => s.updateElement);
  const pushHistory = useCardStudioStore((s) => s.pushHistory);
  const { addTextElement } = useCardEditor();

  const selected = elements.find((el) => el.id === selectedElementId);

  if (!selected || selected.type !== 'text') {
    return (
      <View className="px-4 pt-1 pb-2">
        <CardStudioSectionTitle title="Text Style" subtitle="Select or add text on the canvas" />
        <Pressable
          onPress={() => addTextElement('Your text')}
          className="flex-row items-center justify-center gap-2 py-4 rounded-xl bg-primary/10 border border-primary/20"
          style={{ minHeight: studioTokens.touchMin }}
          accessibilityRole="button"
          accessibilityLabel="Add text element">
          <Type size={18} color={studioTokens.colors.primary} />
          <Text className="text-[13px] font-bold text-primary">Add Text to Canvas</Text>
        </Pressable>
      </View>
    );
  }

  const fontSize = selected.fontSize ?? 20;
  const fontWeight = selected.fontWeight ?? '600';

  const adjustFontSize = (delta: number) => {
    const next = Math.max(10, Math.min(72, fontSize + delta));
    updateElement(selected.id, { fontSize: next });
    pushHistory();
  };

  return (
    <View className="px-4 pt-1 pb-2 gap-2.5">
      <CardStudioSectionTitle title="Text Style" subtitle="Customize selected text" />

      <View className="rounded-xl bg-surface border border-border p-3 gap-3">
        <View>
          <Text className="text-[11px] font-semibold text-foreground-muted mb-2">Font size</Text>
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => adjustFontSize(-2)}
              className="h-10 w-10 rounded-xl bg-background border border-border items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Decrease font size">
              <Minus size={16} color={studioTokens.colors.textSecondary} />
            </Pressable>
            <Text className="text-[16px] font-bold text-foreground flex-1 text-center">{fontSize}px</Text>
            <Pressable
              onPress={() => adjustFontSize(2)}
              className="h-10 w-10 rounded-xl bg-background border border-border items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Increase font size">
              <Plus size={16} color={studioTokens.colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <View>
          <Text className="text-[11px] font-semibold text-foreground-muted mb-2">Weight</Text>
          <View className="flex-row gap-2">
            {FONT_WEIGHTS.map((w) => {
              const active = fontWeight === w.value;
              return (
                <Pressable
                  key={w.value}
                  onPress={() => {
                    updateElement(selected.id, { fontWeight: w.value });
                    pushHistory();
                  }}
                  className={`flex-1 py-2 rounded-lg items-center border ${
                    active ? 'bg-primary/10 border-primary' : 'bg-background border-border'
                  }`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Font weight ${w.label}`}>
                  <Text className={`text-[12px] font-bold ${active ? 'text-primary' : 'text-foreground-muted'}`}>
                    {w.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="text-[11px] font-semibold text-foreground-muted mb-2">Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {TEXT_COLORS.map((color) => {
              const isSelected = selected.color === color;
              return (
                <Pressable
                  key={color}
                  onPress={() => {
                    updateElement(selected.id, { color });
                    pushHistory();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Text color ${color}`}
                  accessibilityState={{ selected: isSelected }}>
                  <View
                    className="rounded-xl border-2"
                    style={{
                      width: studioTokens.swatchSize,
                      height: studioTokens.swatchSize,
                      backgroundColor: color,
                      borderColor: isSelected ? studioTokens.colors.primary : studioTokens.colors.border,
                    }}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
