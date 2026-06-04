import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AlignLeft, ImagePlus, Palette, Sparkles, Type } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

import { studioTokens } from '../../constants/studio-tokens';
import { useCardStudioStore } from '../../store/card-studio.store';
import type { EditorPanel } from '../../types';
import { BackgroundStudio } from './BackgroundStudio';
import { EditorContentPanel } from './EditorContentPanel';
import { EditorEffectsPanel } from './EditorEffectsPanel';
import { EditorMediaPanel } from './EditorMediaPanel';
import { TextColorPicker } from './TextColorPicker';

const TOOLS: { id: EditorPanel; label: string; shortLabel: string; icon: typeof Type }[] = [
  { id: 'content', label: 'Content', shortLabel: 'Content', icon: AlignLeft },
  { id: 'background', label: 'Background', shortLabel: 'BG', icon: Palette },
  { id: 'effects', label: 'Effects', shortLabel: 'FX', icon: Sparkles },
  { id: 'text', label: 'Text', shortLabel: 'Text', icon: Type },
  { id: 'media', label: 'Media', shortLabel: 'Media', icon: ImagePlus },
];

export function MinimalEditorToolbar() {
  const activePanel = useCardStudioStore((s) => s.activePanel);
  const setActivePanel = useCardStudioStore((s) => s.setActivePanel);
  const isDragging = useCardStudioStore((s) => s.isDragging);

  const renderPanel = () => {
    switch (activePanel) {
      case 'content':
        return <EditorContentPanel />;
      case 'background':
        return <BackgroundStudio />;
      case 'effects':
        return <EditorEffectsPanel />;
      case 'text':
        return <TextColorPicker />;
      case 'media':
        return <EditorMediaPanel />;
      default:
        return <EditorContentPanel />;
    }
  };

  const activeTool = TOOLS.find((t) => t.id === activePanel);

  return (
    <View className="flex-1 bg-background">
      <View className="px-3 pt-2 pb-1.5">
        <View
          className="flex-row rounded-2xl bg-surface border border-border p-1"
          style={{ gap: 4 }}>
          {TOOLS.map((tool) => {
            const active = activePanel === tool.id;
            const Icon = tool.icon;
            return (
              <Pressable
                key={tool.id}
                onPress={() => setActivePanel(tool.id)}
                style={{ flex: 1, minHeight: 48 }}
                className="overflow-hidden rounded-xl"
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${tool.label} tools`}>
                {active ? (
                  <LinearGradient
                    colors={[...studioTokens.colors.gradientPrimary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 6,
                      gap: 2,
                    }}>
                    <Icon size={16} color="#FFF" strokeWidth={2.2} />
                    <Text numberOfLines={1} className="text-[10px] font-bold text-white">
                      {tool.shortLabel}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View className="flex-1 items-center justify-center py-1.5">
                    <Icon size={16} color={studioTokens.colors.textMuted} />
                    <Text
                      numberOfLines={1}
                      className="text-[10px] font-semibold text-foreground-muted mt-0.5">
                      {tool.shortLabel}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
        {activeTool ? (
          <Text className="text-[11px] font-semibold text-foreground-muted mt-1.5 px-0.5">
            {activeTool.label} · Edit your card below
          </Text>
        ) : null}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDragging}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 12, flexGrow: 1 }}>
        <Animated.View key={activePanel} entering={FadeIn.duration(160)}>
          {renderPanel()}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
