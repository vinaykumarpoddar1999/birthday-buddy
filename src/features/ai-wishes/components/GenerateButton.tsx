import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Star, WandSparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';

type Props = {
  onGenerate: () => void;
  isGenerating: boolean;
  generationCount: number;
  disabled?: boolean;
};

export function GenerateButton({ onGenerate, isGenerating, generationCount, disabled = false }: Props) {
  const credits = useAIWishesStore((s) => s.credits);

  return (
    <Animated.View entering={FadeInDown.delay(350).duration(400)} className="px-5 mb-5">
      <Pressable
        onPress={onGenerate}
        disabled={isGenerating || disabled}
        className="overflow-hidden rounded-2xl"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: disabled ? 0.5 : 1,
          shadowColor: disabled ? '#6B7280' : '#7C3AED',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 10,
        })}
        accessibilityRole="button"
        accessibilityLabel="Generate wish">
        <LinearGradient
          colors={disabled ? ['#9CA3AF', '#6B7280'] : ['#7C3AED', '#9333EA', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View className="flex-row items-center justify-center py-4 gap-2.5">
            {isGenerating ? (
              <>
                <ActivityIndicator size="small" color="#FFF" />
                <Text className="text-[16px] font-bold text-white">
                  Writing magic...
                </Text>
              </>
            ) : (
              <>
                <WandSparkles size={20} color="#FFF" />
                <Text className="text-[16px] font-bold text-white">
                  {generationCount > 0 ? 'Regenerate Wish' : 'Generate Wish'}
                </Text>
                <Sparkles size={16} color="#FCD34D" />
              </>
            )}
          </View>
        </LinearGradient>
      </Pressable>

      {!disabled && (
        <View className="flex-row items-center justify-center gap-1.5 mt-2">
          <Star size={10} color="#7C3AED" fill="#7C3AED" />
          <Text className="text-[11px] text-foreground-muted">
            <Text className="font-bold text-primary">{credits}</Text> credits remaining
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
