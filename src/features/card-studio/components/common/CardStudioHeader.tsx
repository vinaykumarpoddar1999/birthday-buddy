import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, Sparkles } from 'lucide-react-native';

type Props = {
  onBack: () => void;
  title?: string;
  rightElement?: React.ReactNode;
};

export function CardStudioHeader({ onBack, title = 'Create Card', rightElement }: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 py-3">
      <Pressable
        onPress={onBack}
        className="h-10 w-10 rounded-full bg-gray-100 items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <ChevronLeft size={22} color="#111827" />
      </Pressable>

      <View className="flex-row items-center gap-1.5">
        <Text className="text-title font-bold text-foreground">{title}</Text>
        <Sparkles size={16} color="#7C3AED" />
      </View>

      {rightElement || <View className="w-10" />}
    </View>
  );
}
