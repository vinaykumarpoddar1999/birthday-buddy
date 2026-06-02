import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Star, WandSparkles } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAIWishesStore } from '../store/ai-wishes.store';
import { WishGradients, WishShadows } from '../constants/design-tokens';

type Props = {
  onGenerate: () => void;
  isGenerating: boolean;
  generationCount: number;
  disabled?: boolean;
};

function GeneratingDots() {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })),
      -1,
      true,
    );
  }, [opacity]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="flex-row items-center gap-1 mr-1">
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={[
            dotStyle,
            {
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              marginLeft: i > 0 ? 2 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function GenerateButton({ onGenerate, isGenerating, generationCount, disabled = false }: Props) {
  const credits = useAIWishesStore((s) => s.credits);
  const label = generationCount > 0 ? 'Regenerate Wish' : 'Generate Wish';

  return (
    <Animated.View entering={FadeInDown.delay(350).duration(400)} className="px-5 mb-5">
      <Pressable
        onPress={onGenerate}
        disabled={isGenerating || disabled}
        className="overflow-hidden rounded-2xl"
        style={({ pressed }) => ({
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          opacity: disabled ? 0.55 : 1,
          ...(disabled ? {} : WishShadows.glow),
        })}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isGenerating || disabled }}>
        <LinearGradient
          colors={disabled ? ['#9CA3AF', '#6B7280'] : [...WishGradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View className="flex-row items-center justify-center py-4 gap-2.5">
            {isGenerating ? (
              <>
                <GeneratingDots />
                <Text className="text-[16px] font-bold text-white">Crafting your wish...</Text>
              </>
            ) : (
              <>
                <WandSparkles size={20} color="#FFF" />
                <Text className="text-[16px] font-bold text-white">{label}</Text>
                <Sparkles size={16} color="#FCD34D" />
              </>
            )}
          </View>
        </LinearGradient>
      </Pressable>

      {!disabled && (
        <View className="flex-row items-center justify-center gap-1.5 mt-2.5">
          <Star size={10} color="#7C3AED" fill="#7C3AED" />
          <Text className="text-[11px] text-foreground-muted">
            <Text className="font-bold text-primary">{credits}</Text> credits remaining
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
