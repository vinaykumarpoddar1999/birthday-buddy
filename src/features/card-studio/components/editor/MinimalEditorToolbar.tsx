import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ImagePlus, Palette, Sparkles, Type } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import type { EditorPanel } from '../../types';
import { BackgroundStudio } from './BackgroundStudio';
import { EditorContentPanel } from './EditorContentPanel';
import { EditorEffectsPanel } from './EditorEffectsPanel';
import { EditorMediaPanel } from './EditorMediaPanel';
import { TextColorPicker } from './TextColorPicker';

const TOOLS: { id: EditorPanel; label: string; icon: typeof Type }[] = [
  { id: 'content', label: 'Content', icon: Type },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'media', label: 'Media', icon: ImagePlus },
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

  return (
    <View className="flex-1 bg-background border-t border-border">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!isDragging}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, gap: 8 }}>
        {TOOLS.map((tool) => {
          const active = activePanel === tool.id;
          const Icon = tool.icon;
          return (
            <Pressable
              key={tool.id}
              onPress={() => setActivePanel(tool.id)}
              className={`flex-row items-center px-3.5 py-2 rounded-xl gap-1.5 border ${
                active ? 'bg-primary/10 border-primary/30' : 'bg-surface border-border'
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${tool.label} tools`}>
              <Icon size={14} color={active ? '#7C3AED' : '#9CA3AF'} />
              <Text
                className={`text-[11px] font-bold ${
                  active ? 'text-primary' : 'text-foreground-muted'
                }`}>
                {tool.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDragging}
        keyboardShouldPersistTaps="handled">
        {renderPanel()}
      </ScrollView>
    </View>
  );
}
