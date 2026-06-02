import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, Mail, Sparkles } from 'lucide-react-native';

interface OpeningAnimationProps {
  type: 'gift_box' | 'envelope';
  onComplete: () => void;
}

export function OpeningAnimation({ type, onComplete }: OpeningAnimationProps) {
  const scale = useSharedValue(0.1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const lidY = useSharedValue(0);
  const glowScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 120 });

    rotate.value = withDelay(300, withSequence(
      withTiming(-12, { duration: 120 }),
      withTiming(12, { duration: 120 }),
      withTiming(-8, { duration: 100 }),
      withTiming(8, { duration: 100 }),
      withTiming(0, { duration: 100 }),
    ));

    lidY.value = withDelay(800, withSequence(
      withTiming(0, { duration: 200 }),
      withSpring(-50, { damping: 5, stiffness: 80 }),
    ));

    glowScale.value = withDelay(1100, withTiming(3, { duration: 600 }));
    glowOpacity.value = withDelay(1100, withSequence(
      withTiming(0.6, { duration: 300 }),
      withTiming(0, { duration: 500 }),
    ));

    sparkle1.value = withDelay(900, withTiming(1, { duration: 400 }));
    sparkle2.value = withDelay(1050, withTiming(1, { duration: 400 }));
    sparkle3.value = withDelay(1200, withTiming(1, { duration: 400 }));

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
      setTimeout(onComplete, 600);
    }, 2500);

    return () => clearTimeout(timer);
  }, [glowOpacity, glowScale, lidY, onComplete, opacity, rotate, scale, sparkle1, sparkle2, sparkle3]);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lidY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const sp1 = useAnimatedStyle(() => ({
    transform: [{ scale: sparkle1.value }, { translateX: -60 }, { translateY: -50 }],
    opacity: sparkle1.value,
  }));

  const sp2 = useAnimatedStyle(() => ({
    transform: [{ scale: sparkle2.value }, { translateX: 55 }, { translateY: -30 }],
    opacity: sparkle2.value,
  }));

  const sp3 = useAnimatedStyle(() => ({
    transform: [{ scale: sparkle3.value }, { translateX: 0 }, { translateY: -70 }],
    opacity: sparkle3.value,
  }));

  return (
    <LinearGradient
      colors={['#0F0A2E', '#1E1B4B', '#312E81']}
      className="flex-1 items-center justify-center">
      <Animated.View style={glowStyle} className="absolute">
        <View className="w-40 h-40 rounded-full bg-primary/30" />
      </Animated.View>

      <Animated.View style={boxStyle}>
        <View className="items-center">
          <Animated.View style={sp1} className="absolute">
            <Sparkles size={20} color="#FBBF24" />
          </Animated.View>
          <Animated.View style={sp2} className="absolute">
            <Sparkles size={16} color="#F472B6" />
          </Animated.View>
          <Animated.View style={sp3} className="absolute">
            <Sparkles size={18} color="#A78BFA" />
          </Animated.View>

          {type === 'gift_box' ? (
            <>
              <Animated.View style={lidStyle}>
                <LinearGradient
                  colors={['#C084FC', '#A855F7', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="items-center justify-center"
                  style={{ width: 140, height: 36, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                  <Text className="text-[16px]">🎀</Text>
                </LinearGradient>
              </Animated.View>
              <LinearGradient
                colors={['#7C3AED', '#9333EA', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="items-center justify-center"
                style={{ width: 140, height: 110, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <Gift size={52} color="#FFF" strokeWidth={1.5} />
              </LinearGradient>
            </>
          ) : (
            <LinearGradient
              colors={['#7C3AED', '#9333EA', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="items-center justify-center"
              style={{ width: 150, height: 130, borderRadius: 24 }}>
              <Mail size={60} color="#FFF" strokeWidth={1.5} />
            </LinearGradient>
          )}
        </View>
      </Animated.View>

      <Animated.View style={{ opacity }} className="mt-8 items-center">
        <Text className="text-white text-[20px] font-black text-center">
          Opening your surprise...
        </Text>
        <Text className="text-white/50 text-[14px] mt-2 text-center">
          Get ready for something magical ✨
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

interface LandingScreenProps {
  senderName?: string;
  welcomeMessage?: string;
  onOpen: () => void;
}

export function LandingScreen({ senderName, welcomeMessage, onOpen }: LandingScreenProps) {
  const pulse = useSharedValue(1);
  const floatY = useSharedValue(0);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 8, stiffness: 100 });

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [floatY, iconScale, pulse]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateY: floatY.value }],
  }));

  return (
    <LinearGradient
      colors={['#0F0A2E', '#1E1B4B', '#7C3AED', '#EC4899']}
      locations={[0, 0.3, 0.7, 1]}
      className="flex-1 items-center justify-center px-8">
      <Animated.View style={iconStyle} className="mb-6">
        <View
          className="h-28 w-28 rounded-[32px] items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <Text className="text-[56px]">🎁</Text>
        </View>
      </Animated.View>

      <Text className="text-white text-[28px] font-black text-center leading-9">
        Someone created a{'\n'}surprise for you
      </Text>
      <Text className="text-white/70 text-[16px] text-center mt-4 leading-7 px-4">
        {welcomeMessage ||
          (senderName
            ? `${senderName} made something special just for you ❤️`
            : 'Get ready for something magical ❤️')}
      </Text>

      <Animated.View style={btnStyle} className="mt-12">
        <Pressable
          onPress={onOpen}
          accessibilityRole="button"
          accessibilityLabel="Open surprise"
          className="rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#FFF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 8,
          }}>
          <LinearGradient
            colors={['#FFFFFF', '#F3E8FF']}
            className="px-12 py-5 flex-row items-center">
            <Gift size={22} color="#7C3AED" />
            <Text className="text-primary text-[18px] font-black ml-3">Open Surprise</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Text className="text-white/30 text-[12px] mt-8">Tap to unwrap the magic</Text>
    </LinearGradient>
  );
}
