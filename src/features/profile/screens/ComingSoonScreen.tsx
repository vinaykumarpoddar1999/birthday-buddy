import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const FEATURE_COPY: Record<string, { title: string; subtitle: string }> = {
  'surprise-link': {
    title: 'Surprise Link',
    subtitle: 'Share a secret birthday link with countdown, photos, and a personal message.',
  },
  'gift-ideas': {
    title: 'Gift Ideas',
    subtitle: 'AI-powered gift suggestions tailored to each person you celebrate.',
  },
};

export function ComingSoonScreen() {
  const { feature } = useLocalSearchParams<{ feature?: string }>();
  const copy = FEATURE_COPY[feature ?? ''] ?? {
    title: 'Coming Soon',
    subtitle: 'We are crafting something special for your next celebration.',
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">{copy.title}</Text>
      </View>

      <View className="flex-1 px-5 items-center justify-center pb-24">
        <LinearGradient
          colors={['#EDE9FE', '#F5F3FF', '#FFFFFF']}
          className="w-full rounded-3xl p-8 items-center border border-primary/15">
          <View className="h-20 w-20 rounded-3xl bg-primary/10 items-center justify-center mb-5">
            <Sparkles size={36} color="#7C3AED" />
          </View>
          <Text className="text-[13px] font-bold text-primary uppercase tracking-widest mb-2">
            Coming Soon
          </Text>
          <Text className="text-[22px] font-bold text-foreground text-center mb-3">{copy.title}</Text>
          <Text className="text-[14px] text-foreground-secondary text-center leading-6">
            {copy.subtitle}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-8 bg-primary rounded-2xl px-8 py-3.5"
            accessibilityRole="button">
            <Text className="text-[15px] font-bold text-white">Go Back</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
