import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { BackgroundEffect, BackgroundEffectType } from '../../types';

const EFFECT_OPTIONS: { type: BackgroundEffectType; label: string }[] = [
  { type: 'blur', label: 'Blur' },
  { type: 'overlay', label: 'Overlay' },
  { type: 'glass', label: 'Glass' },
  { type: 'glow', label: 'Glow' },
];

export function EditorEffectsPanel() {
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const setCustomBackground = useCardStudioStore((s) => s.setCustomBackground);

  const toggleEffect = useCallback(
    (type: BackgroundEffectType) => {
      const current = customBackground ?? { type: 'solid' as const, value: '#FFFFFF' };
      const effects = current.effects ?? [];
      const exists = effects.find((e) => e.type === type);
      const nextEffects: BackgroundEffect[] = exists
        ? effects.filter((e) => e.type !== type)
        : [
            ...effects,
            {
              type,
              intensity: type === 'blur' ? 0.35 : 0.5,
              color: type === 'glow' ? 'rgba(124,58,237,0.35)' : '#000000',
            },
          ];
      if (type === 'blur' && !exists) {
        setCustomBackground({ ...current, blur: 8, effects: nextEffects });
        return;
      }
      setCustomBackground({ ...current, effects: nextEffects });
    },
    [customBackground, setCustomBackground],
  );

  const activeEffects = customBackground?.effects?.map((e) => e.type) ?? [];
  const blurOn = (customBackground?.blur ?? 0) > 0 || activeEffects.includes('blur');

  return (
    <View className="px-4 pb-3">
      <Text className="text-[12px] text-foreground-muted mb-2">Background effects</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {EFFECT_OPTIONS.map((opt) => {
          const active = opt.type === 'blur' ? blurOn : activeEffects.includes(opt.type);
          return (
            <Pressable
              key={opt.type}
              onPress={() => toggleEffect(opt.type)}
              className={`px-4 py-2.5 rounded-xl border ${
                active ? 'bg-primary/10 border-primary' : 'bg-surface border-border'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${opt.label} effect`}>
              <Text
                className={`text-[12px] font-bold ${
                  active ? 'text-primary' : 'text-foreground-secondary'
                }`}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
