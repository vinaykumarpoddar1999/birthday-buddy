import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw, Sparkles, WandSparkles } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { WishGradients, WishShadows } from '../constants/design-tokens';

type Props = {
  onGenerate: () => void;
  isGenerating: boolean;
  generationCount: number;
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

export function GenerateButton({ onGenerate, isGenerating, generationCount }: Props) {
  const isRegenerate = generationCount > 0;
  const label = isRegenerate ? 'Regenerate Wish' : 'Generate Wish';
  const Icon = isRegenerate ? RefreshCw : WandSparkles;

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-5 mb-5">
      <Pressable
        onPress={onGenerate}
        disabled={isGenerating}
        className="overflow-hidden rounded-2xl"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
          ...WishShadows.glow,
        })}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isGenerating }}>
        <LinearGradient
          colors={[...WishGradients.primary]}
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
                <Icon size={20} color="#FFF" />
                <Text className="text-[16px] font-bold text-white">{label}</Text>
                <Sparkles size={16} color="#FCD34D" />
              </>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
