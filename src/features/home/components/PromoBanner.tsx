import { Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Image as ImageIcon, Music, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

function CardMock({ rotate, offsetX, zIndex, colors }: {
  rotate: string;
  offsetX: number;
  zIndex: number;
  colors: [string, string];
}) {
  return (
    <View
      className="absolute h-[72px] w-[52px] rounded-lg overflow-hidden border border-white/80 shadow-sm"
      style={{ transform: [{ rotate }], left: offsetX, zIndex }}>
      <LinearGradient colors={colors} style={{ flex: 1, padding: 6 }}>
        <View className="h-6 w-full rounded bg-white/50 items-center justify-center mb-1">
          <ImageIcon size={12} color="#7C3AED" />
        </View>
        <Text className="text-[6px] font-bold text-white leading-[8px]">Happy{'\n'}Birthday</Text>
      </LinearGradient>
    </View>
  );
}

export function PromoBanner() {
  return (
    <View className="rounded-lg overflow-hidden shadow-card mb-5">
      <LinearGradient
        colors={['#FCE7F3', '#EDE9FE', '#DBEAFE']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}>
        <View className="flex-row p-4 items-center min-h-[130px]">
          <View className="flex-1 pr-3 min-w-0">
            <Text className="text-[17px] leading-[22px] text-foreground font-bold">
              Make it extra special
            </Text>
            <View className="flex-row items-start gap-1.5 mt-1.5">
              <Sparkles size={14} color="#7C3AED" strokeWidth={2} className="mt-0.5" />
              <Text className="text-caption text-foreground-secondary flex-1 leading-[18px]">
                Create stunning cards, add photos, music and AI magic
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              className="mt-3 self-start bg-primary rounded-full px-4 py-2.5 flex-row items-center"
              onPress={() => router.push('/card-studio')}>
              <Text className="text-caption text-white font-semibold">Explore Cards</Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </Pressable>
          </View>
          <View className="w-[100px] h-[88px] relative shrink-0">
            <CardMock rotate="-12deg" offsetX={0} zIndex={1} colors={['#A78BFA', '#7C3AED']} />
            <CardMock rotate="4deg" offsetX={22} zIndex={2} colors={['#F472B6', '#EC4899']} />
            <CardMock rotate="14deg" offsetX={44} zIndex={3} colors={['#60A5FA', '#3B82F6']} />
            <View className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white/70 items-center justify-center">
              <Sparkles size={14} color="#7C3AED" />
            </View>
            <View className="absolute top-2 right-8 h-6 w-6 rounded-full bg-white/60 items-center justify-center">
              <Music size={12} color="#EC4899" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
