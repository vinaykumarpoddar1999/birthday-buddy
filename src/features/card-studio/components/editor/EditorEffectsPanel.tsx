import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Droplets, Layers, Sparkles, Sun } from 'lucide-react-native';

import { CardStudioSectionTitle } from '../common/CardStudioSectionTitle';
import { studioTokens } from '../../constants/studio-tokens';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { BackgroundEffect, BackgroundEffectType } from '../../types';

const EFFECT_OPTIONS: {
  type: BackgroundEffectType;
  label: string;
  description: string;
  Icon: typeof Sparkles;
}[] = [
  { type: 'blur', label: 'Blur', description: 'Soft focus', Icon: Droplets },
  { type: 'overlay', label: 'Overlay', description: 'Dark tint', Icon: Layers },
  { type: 'glass', label: 'Glass', description: 'Frosted look', Icon: Sun },
  { type: 'glow', label: 'Glow', description: 'Color glow', Icon: Sparkles },
];

export function EditorEffectsPanel() {
  const customBackground = useCardStudioStore((s) => s.customBackground);
  const selectedTemplate = useCardStudioStore((s) => s.selectedTemplate);
  const setCustomBackground = useCardStudioStore((s) => s.setCustomBackground);

  const toggleEffect = useCallback(
    (type: BackgroundEffectType) => {
      const current =
        customBackground ??
        selectedTemplate?.background ??
        ({ type: 'solid' as const, value: '#FFFFFF' });
      const effects = current.effects ?? [];
      const exists = effects.find((e) => e.type === type);

      if (exists) {
        const nextEffects = effects.filter((e) => e.type !== type);
        const nextBlur = type === 'blur' ? 0 : current.blur;
        setCustomBackground({ ...current, blur: nextBlur, effects: nextEffects });
        return;
      }

      const newEffect: BackgroundEffect = {
        type,
        intensity: type === 'blur' ? 0.35 : 0.5,
        color: type === 'glow' ? 'rgba(124,58,237,0.35)' : '#000000',
      };
      const nextEffects = [...effects, newEffect];
      const nextBlur = type === 'blur' ? 8 : current.blur;
      setCustomBackground({ ...current, blur: nextBlur, effects: nextEffects });
    },
    [customBackground, selectedTemplate?.background, setCustomBackground],
  );

  const activeEffects = customBackground?.effects?.map((e) => e.type) ?? [];
  const blurOn = (customBackground?.blur ?? 0) > 0 || activeEffects.includes('blur');

  return (
    <View className="px-4 pt-1 pb-2">
      <CardStudioSectionTitle title="Effects" subtitle="Add visual flair to your background" />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {EFFECT_OPTIONS.map((opt) => {
          const active = opt.type === 'blur' ? blurOn : activeEffects.includes(opt.type);
          const { Icon } = opt;
          return (
            <Pressable
              key={opt.type}
              onPress={() => toggleEffect(opt.type)}
              style={{ minWidth: 88, minHeight: 72 }}
              className={`px-3 py-2.5 rounded-xl items-center justify-center border-2 ${
                active ? 'bg-primary/10 border-primary' : 'bg-surface border-border'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${opt.label} effect`}>
              <Icon size={18} color={active ? studioTokens.colors.primary : studioTokens.colors.textMuted} />
              <Text
                className={`text-[11px] font-bold mt-1 ${
                  active ? 'text-primary' : 'text-foreground-secondary'
                }`}>
                {opt.label}
              </Text>
              <Text className="text-[9px] text-foreground-muted">{opt.description}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
