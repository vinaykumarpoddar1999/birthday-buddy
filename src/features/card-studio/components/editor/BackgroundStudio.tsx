import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image as ImageIcon, Palette, RotateCw, Trash2, ZoomIn } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { BackgroundEffect, CardBackground } from '../../types';
import {
  GRADIENT_DIRECTIONS,
  GRADIENT_PRESETS,
  SOLID_COLOR_PRESETS,
} from '../../utils/background-presets';

type BgTab = 'color' | 'gradient' | 'image' | 'effects';

const EFFECT_OPTIONS: { type: BackgroundEffect['type']; label: string }[] = [
  { type: 'overlay', label: 'Overlay' },
  { type: 'vignette', label: 'Vignette' },
  { type: 'glass', label: 'Glass' },
  { type: 'glow', label: 'Glow' },
];

export function BackgroundStudio() {
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const setCustomBackground = useCardStudioStore((s) => s.setCustomBackground);
  const recentColors = useCardStudioStore((s) => s.recentColors);
  const recentBackgrounds = useCardStudioStore((s) => s.recentBackgrounds);
  const [tab, setTab] = React.useState<BgTab>('gradient');

  const applyBg = useCallback(
    (bg: CardBackground) => setCustomBackground(bg),
    [setCustomBackground],
  );

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

  const toggleEffect = useCallback(
    (type: BackgroundEffect['type']) => {
      const current = customBackground ?? { type: 'solid' as const, value: '#FFFFFF' };
      const effects = current.effects ?? [];
      const exists = effects.find((e) => e.type === type);
      const nextEffects = exists
        ? effects.filter((e) => e.type !== type)
        : [...effects, { type, intensity: 0.5, color: type === 'glow' ? 'rgba(124,58,237,0.3)' : '#000' }];
      applyBg({ ...current, effects: nextEffects });
    },
    [customBackground, applyBg],
  );

  const adjustImage = useCallback(
    (key: 'blur' | 'imageScale' | 'overlayOpacity', delta: number) => {
      if (!customBackground || customBackground.type !== 'image') return;
      const current = customBackground[key] ?? (key === 'imageScale' ? 1 : 0);
      applyBg({ ...customBackground, [key]: Math.max(0, Math.min(key === 'imageScale' ? 2 : 1, current + delta)) });
    },
    [customBackground, applyBg],
  );

  const TabBtn = ({ id, label }: { id: BgTab; label: string }) => (
    <Pressable
      onPress={() => setTab(id)}
      className={`px-3.5 py-2 rounded-xl ${tab === id ? 'bg-primary/10' : 'bg-gray-50'}`}
      accessibilityRole="button"
      accessibilityLabel={`${label} tab${tab === id ? ', active' : ''}`}>
      <Text className={`text-[11px] font-bold ${tab === id ? 'text-primary' : 'text-foreground-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="px-4 pb-2">
      <View className="flex-row items-center mb-3 gap-2">
        <Palette size={16} color="#7C3AED" />
        <Text className="text-[15px] font-bold text-foreground flex-1">Background Studio</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3" contentContainerStyle={{ gap: 8 }}>
        <TabBtn id="color" label="Color" />
        <TabBtn id="gradient" label="Gradient" />
        <TabBtn id="image" label="Image" />
        <TabBtn id="effects" label="Effects" />
      </ScrollView>

      {tab === 'color' ? (
        <>
          <Text className="text-[11px] text-foreground-muted mb-2">Solid Colors</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2">
              {[...recentColors, ...SOLID_COLOR_PRESETS].slice(0, 16).map((color, i) => (
                <Pressable
                  key={`${color}-${i}`}
                  onPress={() => applyBg({ type: 'solid', value: color })}
                  accessibilityRole="button"
                  accessibilityLabel={`Background color ${color}`}>
                  <View
                    className="h-11 w-11 rounded-xl border-2"
                    style={{
                      backgroundColor: color,
                      borderColor: customBackground?.type === 'solid' && customBackground.value === color ? '#7C3AED' : '#E5E7EB',
                    }}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </>
      ) : null}

      {tab === 'gradient' ? (
        <>
          <Text className="text-[11px] text-foreground-muted mb-2">Premium Presets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2.5">
              {GRADIENT_PRESETS.map((bg) => (
                <Pressable
                  key={bg.name}
                  onPress={() => applyBg(bg)}
                  accessibilityRole="button"
                  accessibilityLabel={`Gradient ${bg.name}`}>
                  <LinearGradient
                    colors={(bg.value as string[]) as [string, string, ...string[]]}
                    start={bg.gradientStart}
                    end={bg.gradientEnd}
                    style={{ width: 72, height: 48, borderRadius: 14, borderWidth: 2, borderColor: '#E5E7EB' }}
                  />
                  <Text className="text-[9px] text-foreground-muted mt-1 text-center">{bg.name}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Text className="text-[11px] text-foreground-muted mb-2">Direction</Text>
          <View className="flex-row gap-2 mb-2">
            {GRADIENT_DIRECTIONS.map((dir) => (
              <Pressable
                key={dir.label}
                onPress={() => {
                  if (customBackground?.type === 'gradient') {
                    applyBg({ ...customBackground, gradientStart: dir.start, gradientEnd: dir.end });
                  }
                }}
                className="h-9 w-9 rounded-lg bg-gray-50 items-center justify-center border border-gray-100"
                accessibilityRole="button"
                accessibilityLabel={`Gradient direction ${dir.label}`}>
                <Text className="text-[14px]">{dir.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {tab === 'image' ? (
        <>
          <Pressable
            onPress={pickImage}
            className="flex-row items-center justify-center py-3.5 rounded-2xl bg-white border border-gray-100 gap-2 mb-3"
            accessibilityRole="button">
            <ImageIcon size={16} color="#7C3AED" />
            <Text className="text-[13px] font-semibold text-foreground">Upload Background Image</Text>
          </Pressable>
          {customBackground?.type === 'image' ? (
            <View className="flex-row gap-2 mb-2">
              <Pressable onPress={() => adjustImage('blur', 0.1)} className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-gray-50 gap-1" accessibilityRole="button">
                <ZoomIn size={14} color="#7C3AED" />
                <Text className="text-[11px] font-semibold">Blur+</Text>
              </Pressable>
              <Pressable onPress={() => adjustImage('imageScale', 0.1)} className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-gray-50 gap-1" accessibilityRole="button">
                <ZoomIn size={14} color="#7C3AED" />
                <Text className="text-[11px] font-semibold">Zoom+</Text>
              </Pressable>
              <Pressable onPress={pickImage} className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-gray-50 gap-1" accessibilityRole="button">
                <RotateCw size={14} color="#7C3AED" />
                <Text className="text-[11px] font-semibold">Replace</Text>
              </Pressable>
              <Pressable onPress={() => setCustomBackground(null)} className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-red-50 gap-1" accessibilityRole="button">
                <Trash2 size={14} color="#DC2626" />
                <Text className="text-[11px] font-semibold text-red-600">Delete</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      ) : null}

      {tab === 'effects' ? (
        <View className="flex-row flex-wrap gap-2 mb-2">
          {EFFECT_OPTIONS.map(({ type, label }) => {
            const active = customBackground?.effects?.some((e) => e.type === type);
            return (
              <Pressable
                key={type}
                onPress={() => toggleEffect(type)}
                className={`px-3.5 py-2.5 rounded-xl border ${active ? 'bg-primary/10 border-primary/30' : 'bg-white border-gray-100'}`}
                accessibilityRole="button"
                accessibilityLabel={`${label} effect${active ? ', on' : ''}`}>
                <Text className={`text-[12px] font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {recentBackgrounds.length > 0 ? (
        <>
          <Text className="text-[11px] text-foreground-muted mb-2 mt-1">Recently Used</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {recentBackgrounds.slice(0, 6).map((bg, i) => (
                <Pressable key={i} onPress={() => applyBg(bg)} accessibilityRole="button">
                  {bg.type === 'gradient' ? (
                    <LinearGradient
                      colors={(bg.value as string[]) as [string, string, ...string[]]}
                      start={bg.gradientStart}
                      end={bg.gradientEnd}
                      style={{ width: 48, height: 48, borderRadius: 12 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: typeof bg.value === 'string' ? bg.value : '#FFF',
                      }}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </>
      ) : null}

      {customBackground ? (
        <Pressable onPress={() => setCustomBackground(null)} className="mt-3 py-2 items-center" accessibilityRole="button">
          <Text className="text-[12px] text-primary font-semibold">Reset to Template Background</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
