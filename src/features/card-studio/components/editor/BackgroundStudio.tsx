import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image as ImageIcon, Palette } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardBackground } from '../../types';
import { GRADIENT_PRESETS, SOLID_COLOR_PRESETS } from '../../utils/background-presets';

type BgTab = 'color' | 'gradient' | 'image';

export function BackgroundStudio() {
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const setCustomBackground = useCardStudioStore((s) => s.setCustomBackground);
  const recentColors = useCardStudioStore((s) => s.recentColors);
  const [tab, setTab] = useState<BgTab>('gradient');

  const applyBg = useCallback((bg: CardBackground) => setCustomBackground(bg), [setCustomBackground]);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      feedback.error('Permission needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      applyBg({ type: 'image', value: result.assets[0].uri, imageScale: 1 });
    }
  }, [applyBg]);

  const TabBtn = ({ id, label }: { id: BgTab; label: string }) => (
    <Pressable
      onPress={() => setTab(id)}
      className={`px-3.5 py-2 rounded-xl ${tab === id ? 'bg-primary/10' : 'bg-gray-50'}`}
      accessibilityRole="button"
      accessibilityLabel={`${label} tab`}>
      <Text className={`text-[11px] font-bold ${tab === id ? 'text-primary' : 'text-foreground-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="px-4 pb-2">
      <View className="flex-row items-center mb-2 gap-2">
        <Palette size={16} color="#7C3AED" />
        <Text className="text-[14px] font-bold text-foreground flex-1">Background</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 8 }}>
        <TabBtn id="gradient" label="Gradient" />
        <TabBtn id="color" label="Solid" />
        <TabBtn id="image" label="Image" />
      </ScrollView>

      {tab === 'color' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {[...recentColors, ...SOLID_COLOR_PRESETS].slice(0, 16).map((color, i) => (
              <Pressable
                key={`${color}-${i}`}
                onPress={() => applyBg({ type: 'solid', value: color })}
                accessibilityRole="button"
                accessibilityLabel={`Solid color ${color}`}>
                <View
                  className="h-11 w-11 rounded-xl border-2"
                  style={{
                    backgroundColor: color,
                    borderColor:
                      customBackground?.type === 'solid' && customBackground.value === color
                        ? '#7C3AED'
                        : '#E5E7EB',
                  }}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : null}

      {tab === 'gradient' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {GRADIENT_PRESETS.map((preset) => (
            <Pressable
              key={preset.name}
              onPress={() => applyBg(preset)}
              accessibilityRole="button"
              accessibilityLabel={`Gradient ${preset.name}`}>
              <LinearGradient
                colors={
                  (Array.isArray(preset.value)
                    ? preset.value
                    : [preset.value, preset.value]) as [string, string, ...string[]]
                }
                start={preset.gradientStart ?? { x: 0, y: 0 }}
                end={preset.gradientEnd ?? { x: 1, y: 1 }}
                style={{ width: 72, height: 72, borderRadius: 14, borderWidth: 2, borderColor: '#E5E7EB' }}
              />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      {tab === 'image' ? (
        <Pressable
          onPress={pickImage}
          className="flex-row items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-primary/40 bg-primary/5"
          accessibilityRole="button"
          accessibilityLabel="Upload background image">
          <ImageIcon size={18} color="#7C3AED" />
          <Text className="text-[13px] font-semibold text-primary">Upload background image</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
