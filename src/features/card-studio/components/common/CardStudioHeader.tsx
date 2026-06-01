import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, RotateCcw, RotateCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View className="flex-row items-center justify-between px-5 py-2.5">
      <Pressable
        onPress={onBack}
        className="h-10 w-10 rounded-full bg-white items-center justify-center border border-gray-100"
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 3,
          elevation: 2,
        }}>
        <ChevronLeft size={20} color="#374151" />
      </Pressable>

      <View className="flex-row items-center gap-2">
        <View className="h-5 w-5 rounded-md overflow-hidden">
          <LinearGradient
            colors={['#7C3AED', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: 20, height: 20, borderRadius: 6 }}
          />
        </View>
        <Text className="text-[17px] font-bold text-foreground tracking-tight">{title}</Text>
      </View>

      {showUndoRedo ? (
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={onUndo}
            disabled={!canUndo}
            className={`h-9 w-9 rounded-full items-center justify-center ${canUndo ? 'bg-white border border-gray-100' : 'bg-gray-50'}`}
            accessibilityRole="button"
            accessibilityLabel="Undo">
            <RotateCcw size={15} color={canUndo ? '#374151' : '#D1D5DB'} />
          </Pressable>
          <Pressable
            onPress={onRedo}
            disabled={!canRedo}
            className={`h-9 w-9 rounded-full items-center justify-center ${canRedo ? 'bg-white border border-gray-100' : 'bg-gray-50'}`}
            accessibilityRole="button"
            accessibilityLabel="Redo">
            <RotateCw size={15} color={canRedo ? '#374151' : '#D1D5DB'} />
          </Pressable>
        </View>
      ) : (
        rightElement || <View className="w-10" />
      )}
    </View>
  );
}
