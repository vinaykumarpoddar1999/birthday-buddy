import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useCardStudioStore } from '../store/card-studio.store';
import { CardCanvas } from '../components/editor/CardCanvas';
import { MinimalEditorToolbar } from '../components/editor/MinimalEditorToolbar';

export function Step2CustomizeScreen() {
  const nextStep = useCardStudioStore((s) => s.nextStep);
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
      <View style={{ flexShrink: 0, flex: 0.58, minHeight: 280 }}>
        <CardCanvas editable />
      </View>

      <View style={{ flex: 0.42, minHeight: 160 }}>
        <MinimalEditorToolbar />
      </View>

      <View className="px-5 pb-4 pt-2 bg-background border-t border-border">
        <Pressable
          onPress={nextStep}
          className="overflow-hidden rounded-2xl"
          accessibilityRole="button"
          accessibilityLabel="Preview card">
          <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View className="flex-row items-center justify-center py-4 gap-2">
              <Text className="text-[15px] font-bold text-white">Preview Card</Text>
              <ChevronRight size={18} color="#FFF" />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
