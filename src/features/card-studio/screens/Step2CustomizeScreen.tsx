import React from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardCanvas } from '../components/editor/CardCanvas';
import { MinimalEditorToolbar } from '../components/editor/MinimalEditorToolbar';

export function Step2CustomizeScreen() {
  const template = useCardStudioStore((s) => s.selectedTemplate);
  if (!template) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-[15px] font-semibold text-foreground text-center">
          Choose a template first to start editing your card.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View className="flex-shrink-0" style={{ maxHeight: '46%' }}>
        <CardCanvas editable />
      </View>

      <View className="flex-1 min-h-0 border-t border-border/60">
        <MinimalEditorToolbar />
      </View>
    </KeyboardAvoidingView>
  );
}
