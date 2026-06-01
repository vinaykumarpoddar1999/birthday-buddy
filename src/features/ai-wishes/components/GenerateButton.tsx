import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, WandSparkles } from 'lucide-react-native';

type Props = {
  onGenerate: () => void;
  isGenerating: boolean;
  generationCount: number;
};

export function GenerateButton({ onGenerate, isGenerating, generationCount }: Props) {
  return (
    <View className="px-5 mb-5">
      <Pressable
        onPress={onGenerate}
        disabled={isGenerating}
        className="overflow-hidden rounded-2xl"
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 8,
        })}
        accessibilityRole="button"
        accessibilityLabel="Generate wish">
        <LinearGradient
          colors={['#7C3AED', '#9333EA', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View className="flex-row items-center justify-center py-4 gap-2.5">
            {isGenerating ? (
              <>
                <ActivityIndicator size="small" color="#FFF" />
                <Text className="text-[15px] font-bold text-white">
                  Writing magic...
                </Text>
              </>
            ) : (
              <>
                <WandSparkles size={18} color="#FFF" />
                <Text className="text-[15px] font-bold text-white">
                  {generationCount > 0 ? 'Regenerate Wish' : 'Generate Wish'}
                </Text>
                <Sparkles size={14} color="#FFF" style={{ opacity: 0.7 }} />
              </>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
