import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image as ImageIcon, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { CardStudioSectionTitle } from '../common/CardStudioSectionTitle';
import { studioTokens } from '../../constants/studio-tokens';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { CardBackground } from '../../types';
import { GRADIENT_PRESETS, SOLID_COLOR_PRESETS } from '../../utils/background-presets';

type BgTab = 'color' | 'gradient' | 'image';

function isSameBackground(a: CardBackground | null | undefined, b: CardBackground): boolean {
  if (!a) return false;
  if (a.type !== b.type) return false;
  if (a.type === 'gradient') {
    return JSON.stringify(a.value) === JSON.stringify(b.value);
  }
  return a.value === b.value;
}

export function BackgroundStudio() {
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const setCustomBackground = useCardStudioStore((s) => s.setCustomBackground);
  const selectedTemplate = useCardStudioStore((s) => s.selectedTemplate);
  const recentColors = useCardStudioStore((s) => s.recentColors);
  const [tab, setTab] = useState<BgTab>('gradient');

  const applyBg = useCallback((bg: CardBackground) => setCustomBackground(bg), [setCustomBackground]);

  const resetToTemplate = useCallback(() => {
    if (selectedTemplate?.background) {
      setCustomBackground(selectedTemplate.background);
    } else {
      setCustomBackground(null);
    }
  }, [selectedTemplate, setCustomBackground]);

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
      style={{ height: 32 }}
      className={`px-3 rounded-lg items-center justify-center border ${
        tab === id ? 'bg-primary/10 border-primary/30' : 'bg-surface border-border'
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${label} tab`}>
      <Text
        numberOfLines={1}
        className={`text-[11px] font-bold ${tab === id ? 'text-primary' : 'text-foreground-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="px-4 pt-1 pb-2">
      <View className="flex-row items-center mb-2 gap-2">
        <View className="flex-1">
          <CardStudioSectionTitle title="Background" subtitle="Colors, gradients, or photos" />
        </View>
        <Pressable
          onPress={resetToTemplate}
          className="flex-row items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border"
          accessibilityRole="button"
          accessibilityLabel="Reset to template background">
          <RotateCcw size={12} color={studioTokens.colors.primary} />
          <Text className="text-[10px] font-semibold text-primary">Reset</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 8 }}>
        <TabBtn id="gradient" label="Gradient" />
        <TabBtn id="color" label="Solid" />
        <TabBtn id="image" label="Image" />
      </ScrollView>

      {tab === 'color' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {[...recentColors, ...SOLID_COLOR_PRESETS].slice(0, 16).map((color, i) => {
              const preset: CardBackground = { type: 'solid', value: color };
              const selected = isSameBackground(customBackground, preset);
              return (
                <Pressable
                  key={`${color}-${i}`}
                  onPress={() => applyBg(preset)}
                  accessibilityRole="button"
                  accessibilityLabel={`Solid color ${color}`}
                  accessibilityState={{ selected }}>
                  <View
                    className="rounded-xl border-2"
                    style={{
                      width: studioTokens.swatchSize,
                      height: studioTokens.swatchSize,
                      backgroundColor: color,
                      borderColor: selected ? studioTokens.colors.primary : studioTokens.colors.border,
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : null}

      {tab === 'gradient' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {GRADIENT_PRESETS.map((preset) => {
            const selected = isSameBackground(customBackground, preset);
            return (
              <Pressable
                key={preset.name}
                onPress={() => applyBg(preset)}
                accessibilityRole="button"
                accessibilityLabel={`Gradient ${preset.name}`}
                accessibilityState={{ selected }}
                className="items-center">
                <LinearGradient
                  colors={
                    (Array.isArray(preset.value)
                      ? preset.value
                      : [preset.value, preset.value]) as [string, string, ...string[]]
                  }
                  start={preset.gradientStart ?? { x: 0, y: 0 }}
                  end={preset.gradientEnd ?? { x: 1, y: 1 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: selected ? studioTokens.colors.primary : studioTokens.colors.border,
                  }}
                />
                <Text className="text-[9px] text-foreground-muted mt-1 font-medium">{preset.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      {tab === 'image' ? (
        <Pressable
          onPress={pickImage}
          className="flex-row items-center justify-center gap-2 py-5 rounded-xl border border-dashed border-primary/40 bg-primary/5"
          accessibilityRole="button"
          accessibilityLabel="Upload background image">
          <ImageIcon size={18} color={studioTokens.colors.primary} />
          <Text className="text-[13px] font-semibold text-primary">Upload background image</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
