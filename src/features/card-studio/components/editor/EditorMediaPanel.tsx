import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ImagePlus, Smile, Type } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { CardStudioSectionTitle } from '../common/CardStudioSectionTitle';
import { studioTokens } from '../../constants/studio-tokens';

import { useCardStudioStore } from '../../store/card-studio.store';
import { useCardEditor } from '../../hooks/useCardEditor';
import { EMOJI_PRESETS } from '../../utils/background-presets';

export function EditorMediaPanel() {
  const addElement = useCardStudioStore((s) => s.addElement);
  const { addTextElement, addEmojiElement } = useCardEditor();

  const addPhotoElement = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      feedback.error('Permission needed', 'Allow photo library to add images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    const maxZ = Math.max(0, ...useCardStudioStore.getState().elements.map((e) => e.zIndex));
    addElement({
      id: `el-${Date.now()}`,
      type: 'image',
      uri: result.assets[0].uri,
      x: 52,
      y: 120,
      width: 180,
      height: 180,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
      visible: true,
      borderRadius: 18,
    });
  }, [addElement]);

  return (
    <View className="px-4 pt-1 pb-2">
      <CardStudioSectionTitle title="Media" subtitle="Add photos, text, and stickers" />

      <View className="flex-row gap-2 mb-3">
        <Pressable
          onPress={() => addTextElement('Your text')}
          className="flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 py-3"
          accessibilityRole="button"
          accessibilityLabel="Add text">
          <Type size={20} color={studioTokens.colors.primary} />
          <Text className="text-[11px] font-bold text-primary">Add Text</Text>
        </Pressable>
        <Pressable
          onPress={addPhotoElement}
          className="flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface border border-border py-3"
          accessibilityRole="button"
          accessibilityLabel="Add image">
          <ImagePlus size={20} color={studioTokens.colors.textSecondary} />
          <Text className="text-[11px] font-bold text-foreground-secondary">Add Image</Text>
        </Pressable>
      </View>

      <View className="rounded-xl bg-surface border border-border p-3">
        <View className="flex-row items-center gap-2 mb-2">
          <Smile size={14} color={studioTokens.colors.primary} />
          <Text className="text-[11px] font-semibold text-foreground-muted">Stickers & Emojis</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {EMOJI_PRESETS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => addEmojiElement(emoji)}
              className="rounded-xl bg-background border border-border items-center justify-center"
              style={{ width: studioTokens.swatchSize, height: studioTokens.swatchSize }}
              accessibilityRole="button"
              accessibilityLabel={`Add ${emoji}`}>
              <Text className="text-[22px]">{emoji}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
