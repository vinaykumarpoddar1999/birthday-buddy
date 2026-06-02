import { router } from 'expo-router';
import { Calendar, Gift, Heart, Shield } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@shared/ui';
import { useAuth } from '@features/auth';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: Gift,
    gradient: ['#7C3AED', '#A855F7'] as [string, string],
    bg: '#F5F3FF',
    title: 'Never Miss a Birthday',
    description: 'Keep track of every special day for the people you love, all in one beautiful place.',
  },
  {
    icon: Heart,
    gradient: ['#EC4899', '#F472B6'] as [string, string],
    bg: '#FDF2F8',
    title: 'Send Meaningful Wishes',
    description: 'Create personalized AI wishes and stunning birthday cards in seconds.',
  },
  {
    icon: Calendar,
    gradient: ['#3B82F6', '#6366F1'] as [string, string],
    bg: '#EFF6FF',
    title: 'Smart Reminders',
    description: 'Get notified ahead of time so you always have time to prepare something special.',
  },
  {
    icon: Shield,
    gradient: ['#10B981', '#059669'] as [string, string],
    bg: '#ECFDF5',
    title: 'Your Data, Your Control',
    description: 'Offline-first and encrypted. Your memories stay private and secure on your device.',
  },
];

export function OnboardingScreen() {
  const { completeOnboarding, enterGuestMode } = useAuth();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
    } else {
      await completeOnboarding();
      router.replace('/(auth)/welcome');
    }
  };

  const handleSkip = async () => {
    await enterGuestMode();
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#FAFAFA', '#F5F3FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-between items-center px-6 pt-4">
          <View className="flex-row gap-1.5">
            {SLIDES.map((_, i) => (
              <View
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-primary' : 'w-1.5 bg-border'}`}
              />
            ))}
          </View>
          <Pressable onPress={handleSkip} accessibilityRole="button" className="px-3 py-1.5">
            <Text className="text-sm text-foreground-secondary font-semibold">Skip</Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setIndex(newIndex);
          }}
          renderItem={({ item }) => {
            const Icon = item.icon;
            return (
              <View style={{ width }} className="flex-1 items-center justify-center px-10">
                <LinearGradient
                  colors={item.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-32 w-32 rounded-[36px] items-center justify-center mb-10 shadow-lg">
                  <Icon size={56} color="#FFFFFF" />
                </LinearGradient>
                <Text className="text-3xl text-foreground font-bold text-center tracking-tight">
                  {item.title}
                </Text>
                <Text className="text-base text-foreground-secondary text-center mt-4 leading-7 px-2">
                  {item.description}
                </Text>
              </View>
            );
          }}
        />

        <View className="px-6 pb-8 gap-3">
          <Button
            label={index === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
            size="lg"
            onPress={handleNext}
          />
          {index === SLIDES.length - 1 ? (
            <Pressable onPress={handleSkip} className="py-2 items-center" accessibilityRole="button">
              <Text className="text-sm text-foreground-secondary font-medium">
                Skip and explore without account
              </Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}
