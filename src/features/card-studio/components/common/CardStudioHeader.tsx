import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, RotateCcw, RotateCw, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = {
  onBack: () => void;
  title?: string;
  rightElement?: React.ReactNode;
  showUndoRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
};

export function CardStudioHeader({
  onBack,
  title = 'Create Card',
  rightElement,
  showUndoRedo,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) {
  return (
    <View className="px-5 pt-2 pb-3 border-b border-border/60 bg-background">
      <Animated.View entering={FadeInDown.duration(350)} className="flex-row items-center">
        <Pressable
          onPress={onBack}
          className="h-10 w-10 rounded-full items-center justify-center bg-surface border border-border/80"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ChevronLeft size={22} color="#7C3AED" />
        </Pressable>

        <View className="flex-1 flex-row items-center justify-center gap-2 pr-10">
          <View className="h-8 w-8 rounded-xl bg-primary/10 items-center justify-center">
            <Sparkles size={17} color="#7C3AED" strokeWidth={2.2} />
          </View>
          <Text className="text-[17px] font-bold text-foreground tracking-tight">{title}</Text>
        </View>

        {showUndoRedo ? (
          <View className="absolute right-5 flex-row items-center gap-1">
            <Pressable
              onPress={onUndo}
              disabled={!canUndo}
              className={`h-9 w-9 rounded-full items-center justify-center border ${
                canUndo ? 'bg-surface border-border' : 'bg-gray-50 border-transparent'
              }`}
              accessibilityRole="button"
              accessibilityLabel="Undo">
              <RotateCcw size={15} color={canUndo ? '#374151' : '#D1D5DB'} />
            </Pressable>
            <Pressable
              onPress={onRedo}
              disabled={!canRedo}
              className={`h-9 w-9 rounded-full items-center justify-center border ${
                canRedo ? 'bg-surface border-border' : 'bg-gray-50 border-transparent'
              }`}
              accessibilityRole="button"
              accessibilityLabel="Redo">
              <RotateCw size={15} color={canRedo ? '#374151' : '#D1D5DB'} />
            </Pressable>
          </View>
        ) : (
          rightElement || null
        )}
      </Animated.View>
    </View>
  );
}
