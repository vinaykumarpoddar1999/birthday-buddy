import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

function FloatingBalloon({
  left,
  color,
  delay,
  size = 1,
  top = SCREEN_H * 0.12,
}: {
  left: number;
  color: string;
  delay: number;
  size?: number;
  top?: number;
}) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 2000 + delay, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000 + delay, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [delay, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const w = 36 * size;
  const h = 48 * size;

  return (
    <Animated.View style={[styles.floating, { left, top }, style]} pointerEvents="none">
      <Svg width={w} height={h} viewBox="0 0 36 48">
        <Ellipse cx="18" cy="18" rx="14" ry="16" fill={color} opacity={0.85} />
        <Path d="M18 34 L18 44" stroke={color} strokeWidth="1.5" opacity={0.6} />
        <Circle cx="18" cy="44" r="2" fill={color} opacity={0.5} />
      </Svg>
    </Animated.View>
  );
}

function FloatingGift({ right, delay, top = SCREEN_H * 0.22 }: { right: number; delay: number; top?: number }) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(-5);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1800 + delay }),
        withTiming(4, { duration: 1800 + delay }),
      ),
      -1,
      false,
    );
    rotate.value = withRepeat(
      withSequence(withTiming(5, { duration: 2400 }), withTiming(-5, { duration: 2400 })),
      -1,
      false,
    );
  }, [delay, rotate, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.gift, { right, top }, style]} pointerEvents="none">
      <Svg width={32} height={32} viewBox="0 0 32 32">
        <Rect x="4" y="14" width="24" height="16" rx="2" fill="#F472B6" opacity={0.8} />
        <Rect x="14" y="14" width="4" height="16" fill="#EC4899" opacity={0.9} />
        <Rect x="4" y="10" width="24" height="6" rx="1" fill="#FB7185" opacity={0.85} />
        <Path d="M16 10 C16 10 12 6 10 8 C8 10 12 14 16 10" fill="#FBBF24" opacity={0.9} />
        <Path d="M16 10 C16 10 20 6 22 8 C24 10 20 14 16 10" fill="#FBBF24" opacity={0.9} />
      </Svg>
    </Animated.View>
  );
}

function FloatingCake({ left, delay }: { left: number; delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2200 + delay }),
        withTiming(6, { duration: 2200 + delay }),
      ),
      -1,
      false,
    );
  }, [delay, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.cake, { left }, style]} pointerEvents="none">
      <Svg width={36} height={36} viewBox="0 0 36 36">
        <Rect x="6" y="20" width="24" height="12" rx="3" fill="#F472B6" opacity={0.85} />
        <Rect x="8" y="14" width="20" height="8" rx="2" fill="#FB7185" opacity={0.9} />
        <Rect x="10" y="10" width="16" height="6" rx="2" fill="#FBBF24" opacity={0.95} />
        <Circle cx="14" cy="8" r="2" fill="#EF4444" />
        <Circle cx="18" cy="7" r="2" fill="#22C55E" />
        <Circle cx="22" cy="8" r="2" fill="#3B82F6" />
      </Svg>
    </Animated.View>
  );
}

function ConfettiDot({ left, top, color, size }: { left: number; top: number; color: string; size: number }) {
  return (
    <View
      style={[styles.confetti, { left, top, width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}
      pointerEvents="none"
    />
  );
}

export function CelebrationBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#9F4CFF', '#C4B5FD', '#FDF4FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <FloatingBalloon left={20} color="#F472B6" delay={0} size={0.9} />
      <FloatingBalloon left={SCREEN_W - 80} color="#60A5FA" delay={300} size={1.1} />
      <FloatingBalloon left={SCREEN_W * 0.55} color="#A78BFA" delay={600} size={0.75} top={SCREEN_H * 0.08} />
      <FloatingBalloon left={SCREEN_W * 0.35} color="#FBBF24" delay={450} size={0.65} top={SCREEN_H * 0.18} />
      <FloatingGift right={24} delay={200} />
      <FloatingGift right={100} delay={500} top={SCREEN_H * 0.28} />
      <FloatingCake left={SCREEN_W * 0.12} delay={350} />
      <FloatingCake left={SCREEN_W - 56} delay={700} />
      <ConfettiDot left={48} top={SCREEN_H * 0.32} color="#F472B6" size={6} />
      <ConfettiDot left={SCREEN_W - 60} top={SCREEN_H * 0.14} color="#60A5FA" size={5} />
      <ConfettiDot left={SCREEN_W * 0.45} top={SCREEN_H * 0.06} color="#FBBF24" size={4} />
      <ConfettiDot left={SCREEN_W * 0.7} top={SCREEN_H * 0.38} color="#A78BFA" size={5} />
      <ConfettiDot left={24} top={SCREEN_H * 0.48} color="#34D399" size={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
  },
  gift: {
    position: 'absolute',
  },
  cake: {
    position: 'absolute',
    top: SCREEN_H * 0.42,
  },
  confetti: {
    position: 'absolute',
    opacity: 0.55,
  },
});
