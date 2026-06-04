import { router } from 'expo-router';
import { Calendar, Gift, Heart, Shield } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
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
import { ConfettiBurst } from '@shared/ui/ConfettiBurst';
import { DURATION, SPRING } from '@/shared/motion/tokens';
import { useAuth } from '@features/auth';

const { width } = Dimensions.get('window');

const LOGO = require('../../../../assets/images/expo-logo.png');

const SLIDES = [
  {
    icon: Gift,
    gradient: ['#7C3AED', '#A855F7'] as [string, string],
    title: 'Never Miss a Birthday',
    description:
      'Keep every friend and family celebration in one beautiful place — organized, joyful, and always within reach.',
    bullet: 'Add people in seconds',
  },
  {
    icon: Heart,
    gradient: ['#EC4899', '#F472B6'] as [string, string],
    title: 'Celebrate With Heart',
    description:
      'Craft AI wishes and stunning greeting cards that feel personal, warm, and unforgettable.',
    bullet: 'Cards & wishes built-in',
  },
  {
    icon: Calendar,
    gradient: ['#3B82F6', '#6366F1'] as [string, string],
    title: 'Reminders That Work',
    description:
      'Smart alerts and full-screen birthday alarms wake you up on the big day — even when your phone is locked.',
    bullet: 'Multiple reminder times',
  },
  {
    icon: Shield,
    gradient: ['#10B981', '#059669'] as [string, string],
    title: 'Private By Design',
    description:
      'Your data stays on your device. Enable system lock anytime for Face ID, fingerprint, or device PIN.',
    bullet: 'Optional system lock',
  },
];

export function OnboardingScreen() {
  const { completeOnboarding, enterGuestMode } = useAuth();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const iconFloat = useSharedValue(0);

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const appNameOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(24);
  const ctaOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: DURATION.entrance });
    logoScale.value = withSpring(1, SPRING.bouncy);
    appNameOpacity.value = withDelay(300, withTiming(1, { duration: DURATION.normal }));
    ctaOpacity.value = withDelay(600, withTiming(1, { duration: DURATION.normal }));
    ctaTranslateY.value = withDelay(600, withSpring(0, SPRING.gentle));
    iconFloat.value = withRepeat(
      withSequence(withTiming(-8, { duration: 1400 }), withTiming(0, { duration: 1400 })),
      -1,
      true,
    );
    const timer = setTimeout(() => setShowConfetti(false), 3200);
    return () => clearTimeout(timer);
  }, [appNameOpacity, ctaOpacity, ctaTranslateY, iconFloat, logoOpacity, logoScale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const appNameStyle = useAnimatedStyle(() => ({
    opacity: appNameOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }));

  const iconFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconFloat.value }],
  }));

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
      <CelebrationBackground />
      {showConfetti ? <ConfettiBurst active durationMs={3200} count={130} /> : null}

      <SafeAreaView className="flex-1">
        <View className="flex-row justify-between items-center px-6 pt-4">
          <Animated.View style={[appNameStyle, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
            <Image source={LOGO} style={{ width: 28, height: 28, borderRadius: 8 }} contentFit="cover" />
            <Text className="text-sm font-bold text-primary tracking-wide">Birthday Buddy</Text>
          </Animated.View>
          <View className="flex-row gap-1.5">
            {SLIDES.map((_, i) => (
              <View
                key={i}
                className={`h-1.5 rounded-full ${i === index ? 'w-8 bg-primary' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </View>
          <Pressable onPress={handleSkip} accessibilityRole="button" className="px-3 py-1.5">
            <Text className="text-sm text-foreground font-semibold">Skip</Text>
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
          renderItem={({ item, index: slideIndex }) => {
            const Icon = item.icon;
            const isFirst = slideIndex === 0;
            return (
              <View style={{ width }} className="flex-1 items-center justify-center px-8">
                <View className="w-full rounded-3xl overflow-hidden border border-white/30 bg-white/25 px-6 py-8 items-center">
                  <Animated.View style={isFirst ? [logoStyle, iconFloatStyle] : iconFloatStyle}>
                    <LinearGradient
                      colors={item.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="h-28 w-28 rounded-[36px] items-center justify-center mb-8"
                      style={{
                        shadowColor: item.gradient[0],
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.35,
                        shadowRadius: 16,
                        elevation: 8,
                      }}>
                      <Icon size={52} color="#FFFFFF" />
                    </LinearGradient>
                  </Animated.View>
                  <Text className="text-2xl text-foreground font-bold text-center tracking-tight leading-8">
                    {item.title}
                  </Text>
                  <Text className="text-base text-foreground-secondary text-center mt-4 leading-7">
                    {item.description}
                  </Text>
                  <View className="mt-5 bg-primary/10 rounded-full px-4 py-2">
                    <Text className="text-[13px] font-bold text-primary text-center">{item.bullet}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />

        <Animated.View style={ctaStyle} className="px-6 pb-8 gap-3">
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
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
