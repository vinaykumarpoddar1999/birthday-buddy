import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image as ImageIcon, Palette } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardBackground } from '../../types';

const SOLID_COLORS = [
  '#FFFFFF', '#FCE7F3', '#EDE9FE', '#DBEAFE', '#D1FAE5',
  '#FEF3C7', '#1F2937', '#7C3AED', '#EC4899', '#0EA5E9',
];

const GRADIENT_PRESETS: CardBackground[] = [
  { type: 'gradient', value: ['#8B5CF6', '#EC4899'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 1 } },
  { type: 'gradient', value: ['#0EA5E9', '#6366F1'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 0 } },
  { type: 'gradient', value: ['#F59E0B', '#EF4444'], gradientStart: { x: 0, y: 1 }, gradientEnd: { x: 1, y: 0 } },
  { type: 'gradient', value: ['#10B981', '#3B82F6'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 0, y: 1 } },
  { type: 'gradient', value: ['#1F2937', '#4C1D95'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 1 } },
  { type: 'gradient', value: ['#FCE7F3', '#EDE9FE', '#DBEAFE'], gradientStart: { x: 0, y: 0 }, gradientEnd: { x: 1, y: 1 } },
];

export function BackgroundPicker() {
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const setCustomBackground = useCardStudioStore((s) => s.setCustomBackground);
  const pushHistory = useCardStudioStore((s) => s.pushHistory);

  const applyBg = useCallback(
    (bg: CardBackground) => {
      setCustomBackground(bg);
      pushHistory();
    },
    [setCustomBackground, pushHistory],
  );

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      feedback.error('Permission needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      applyBg({ type: 'image', value: result.assets[0].uri });
    }
  }, [applyBg]);

  return (
    <View className="px-5 mb-5">
      <View className="flex-row items-center mb-3">
        <Palette size={15} color="#7C3AED" />
        <Text className="text-[15px] font-bold text-foreground ml-2">Background</Text>
      </View>

      <Text className="text-[11px] text-foreground-muted mb-2 ml-0.5">Solid Colors</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {SOLID_COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => applyBg({ type: 'solid', value: color })}
              accessibilityRole="button"
              accessibilityLabel={`Background color ${color}`}>
              <View
                className="h-10 w-10 rounded-xl border-2"
                style={{
                  backgroundColor: color,
                  borderColor: customBackground?.type === 'solid' && customBackground.value === color ? '#7C3AED' : '#E5E7EB',
                }}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Text className="text-[11px] text-foreground-muted mb-2 ml-0.5">Gradients</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {GRADIENT_PRESETS.map((bg, i) => (
            <Pressable key={i} onPress={() => applyBg(bg)} accessibilityRole="button">
              <LinearGradient
                colors={(bg.value as string[]) as [string, string, ...string[]]}
                start={bg.gradientStart}
                end={bg.gradientEnd}
                style={{ height: 40, width: 64, borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB' }}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={pickImage}
        className="flex-row items-center justify-center py-3.5 rounded-2xl bg-white border border-gray-100 gap-2"
        accessibilityRole="button">
        <ImageIcon size={16} color="#7C3AED" />
        <Text className="text-[13px] font-semibold text-foreground">Upload Background Image</Text>
      </Pressable>

      {customBackground ? (
        <Pressable
          onPress={() => setCustomBackground(null)}
          className="mt-2 py-2 items-center"
          accessibilityRole="button">
          <Text className="text-[12px] text-primary font-semibold">Reset to Template Background</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
