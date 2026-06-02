import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { AlignCenter, AlignLeft, AlignRight, Bold, Minus, Plus } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardElement } from '../../types';
import { FONT_COLORS, TEXT_PRESETS } from '../../utils/card-element-render';

type Props = { element: CardElement };

export function TextControls({ element }: Props) {
  const updateElement = useCardStudioStore((s) => s.updateElement);
  const pushHistory = useCardStudioStore((s) => s.pushHistory);

  const update = (updates: Partial<CardElement>) => {
    updateElement(element.id, updates);
  };

  const commit = () => pushHistory();

  return (
    <View className="px-4 pb-2">
      <Text className="text-[11px] font-bold text-foreground-muted mb-2 uppercase tracking-wide">Text</Text>

      <TextInput
        value={element.content || ''}
        onChangeText={(text) => update({ content: text })}
        onBlur={commit}
        placeholder="Enter text..."
        placeholderTextColor="#9CA3AF"
        className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-[14px] text-foreground mb-3"
        accessibilityLabel="Edit text content"
        multiline
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 8 }}>
        {Object.entries(TEXT_PRESETS).map(([key, preset]) => (
          <Pressable
            key={key}
            onPress={() => {
              const { fontSize, fontWeight, textPreset } = preset;
              update({
                fontSize,
                fontWeight,
                textPreset,
                height: Math.max(element.height, fontSize * 1.5),
              });
              commit();
            }}
            className={`px-3 py-2 rounded-xl border ${element.textPreset === key ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
            accessibilityRole="button">
            <Text className={`text-[11px] font-semibold capitalize ${element.textPreset === key ? 'text-primary' : 'text-foreground'}`}>
              {key}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="flex-row items-center justify-between mb-3 bg-white rounded-xl px-3 py-2 border border-gray-100">
        <Text className="text-[12px] font-semibold text-foreground">Size</Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => { update({ fontSize: Math.max(10, (element.fontSize || 16) - 2) }); commit(); }}
            className="h-8 w-8 rounded-lg bg-gray-50 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Decrease font size">
            <Minus size={14} color="#6B7280" />
          </Pressable>
          <Text className="text-[13px] font-bold text-foreground w-8 text-center">{element.fontSize || 16}</Text>
          <Pressable
            onPress={() => { update({ fontSize: Math.min(72, (element.fontSize || 16) + 2) }); commit(); }}
            className="h-8 w-8 rounded-lg bg-gray-50 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Increase font size">
            <Plus size={14} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 8 }}>
        {FONT_COLORS.map((color) => (
          <Pressable
            key={color}
            onPress={() => { update({ color }); commit(); }}
            accessibilityRole="button"
            accessibilityLabel={`Text color ${color}`}>
            <View
              className="h-9 w-9 rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor: element.color === color ? '#7C3AED' : '#E5E7EB',
              }}
            />
          </Pressable>
        ))}
      </ScrollView>

      <View className="flex-row gap-2 mb-2">
        {([
          { align: 'left' as const, Icon: AlignLeft },
          { align: 'center' as const, Icon: AlignCenter },
          { align: 'right' as const, Icon: AlignRight },
        ]).map(({ align, Icon }) => (
          <Pressable
            key={align}
            onPress={() => { update({ textAlign: align }); commit(); }}
            className={`flex-1 py-2.5 rounded-xl items-center border ${element.textAlign === align ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
            accessibilityRole="button"
            accessibilityLabel={`Align ${align}${element.textAlign === align ? ', active' : ''}`}>
            <Icon size={16} color={element.textAlign === align ? '#7C3AED' : '#9CA3AF'} />
          </Pressable>
        ))}
        <Pressable
          onPress={() => {
            update({ fontWeight: element.fontWeight === 'bold' || element.fontWeight === '700' ? '400' : '700' });
            commit();
          }}
          className={`flex-1 py-2.5 rounded-xl items-center border ${element.fontWeight === '700' || element.fontWeight === 'bold' ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
          accessibilityRole="button">
          <Bold size={16} color={element.fontWeight === '700' || element.fontWeight === 'bold' ? '#7C3AED' : '#9CA3AF'} />
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={() => { update({ textShadowColor: element.textShadowColor ? undefined : 'rgba(0,0,0,0.4)', textShadowRadius: 4 }); commit(); }}
          className={`flex-1 py-2 rounded-xl items-center border ${element.textShadowColor ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
          accessibilityRole="button">
          <Text className="text-[11px] font-semibold text-foreground">Shadow</Text>
        </Pressable>
        <Pressable
          onPress={() => { update({ strokeColor: element.strokeColor ? undefined : '#FFF', strokeWidth: element.strokeColor ? undefined : 1 }); commit(); }}
          className={`flex-1 py-2 rounded-xl items-center border ${element.strokeColor ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
          accessibilityRole="button">
          <Text className="text-[11px] font-semibold text-foreground">Stroke</Text>
        </Pressable>
        <Pressable
          onPress={() => { update({ textShadowColor: element.glowColor ? undefined : 'rgba(124,58,237,0.8)', textShadowRadius: element.glowColor ? undefined : 12 }); commit(); }}
          className={`flex-1 py-2 rounded-xl items-center border ${element.textShadowRadius && element.textShadowRadius > 8 ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
          accessibilityRole="button">
          <Text className="text-[11px] font-semibold text-foreground">Glow</Text>
        </Pressable>
      </View>
    </View>
  );
}
