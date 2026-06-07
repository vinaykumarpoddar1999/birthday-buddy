import { router, type Href } from 'expo-router';
import { Bell, Calendar, Gift, Sparkles } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CelebrationBackground } from '@features/auth/components/CelebrationBackground';
import { Button } from '@shared/ui';
import { ROUTES } from '@/constants/routes';
import { DURATION, SPRING } from '@/shared/motion/tokens';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: Calendar,
    gradient: ['#7C3AED', '#A855F7'] as [string, string],
    title: 'Never Miss a Birthday',
    description:
      'Keep every celebration in one place. Track birthdays for friends, family, and everyone who matters to you.',
  },
  {
    icon: Bell,
    gradient: ['#3B82F6', '#6366F1'] as [string, string],
    title: 'Smart Reminders',
    description:
      'Get friendly alerts days ahead or on the morning of the big day, so you are always ready to celebrate.',
  },
  {
    icon: Gift,
    gradient: ['#EC4899', '#F472B6'] as [string, string],
    title: 'Wishes & Cards',
    description:
      'Create heartfelt wishes and beautiful greeting cards that feel personal and make every birthday memorable.',
  },
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const iconFloat = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: DURATION.entrance });
    ctaOpacity.value = withDelay(400, withTiming(1, { duration: DURATION.normal }));
    ctaTranslateY.value = withDelay(400, withSpring(0, SPRING.gentle));
    iconFloat.value = withRepeat(
      withSequence(withTiming(-10, { duration: 1500 }), withTiming(0, { duration: 1500 })),
      -1,
      true,
    );
  }, [ctaOpacity, ctaTranslateY, headerOpacity, iconFloat]);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconFloat.value }],
  }));

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
      return;
    }
    router.replace(ROUTES.profileSetup as Href);
  };

  const handleSkip = () => {
    router.replace(ROUTES.profileSetup as Href);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View className="flex-1">
      <CelebrationBackground />

      <SafeAreaView className="flex-1">
        <Animated.View style={headerStyle} className="flex-row justify-end items-center px-6 pt-4">
          <Pressable
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            className="px-4 py-2 rounded-full bg-surface/90"
            style={{
              shadowColor: '#7C3AED',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <Text className="text-sm text-foreground-secondary font-semibold">Skip</Text>
          </Pressable>
        </Animated.View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }) => {
            const Icon = item.icon;
            return (
              <View style={{ width }} className="flex-1 items-center justify-center px-8">
                <Animated.View style={floatStyle}>
                  <View
                    className="rounded-[44px] mb-10"
                    style={{
                      shadowColor: item.gradient[0],
                      shadowOffset: { width: 0, height: 16 },
                      shadowOpacity: 0.28,
                      shadowRadius: 28,
                      elevation: 14,
                    }}>
                    <LinearGradient
                      colors={item.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        height: 144,
                        width: 144,
                        borderRadius: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon size={64} color="#FFFFFF" strokeWidth={1.75} />
                    </LinearGradient>
                  </View>
                </Animated.View>

                <Text className="text-[30px] text-foreground font-bold text-center tracking-tight leading-9">
                  {item.title}
                </Text>
                <Text className="text-base text-foreground-secondary text-center mt-4 leading-7 px-2">
                  {item.description}
                </Text>
              </View>
            );
          }}
        />

        <View className="flex-row justify-center gap-2 mb-4">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${i === index ? 'w-10 bg-primary' : 'w-2 bg-primary/20'}`}
            />
          ))}
        </View>

        <Animated.View style={ctaStyle} className="px-6 pb-8">
          <Button
            label={index === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
            size="lg"
            onPress={handleNext}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
