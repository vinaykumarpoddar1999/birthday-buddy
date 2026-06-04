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
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function FloatingBalloon({ left, color, delay, size = 1 }: { left: number; color: string; delay: number; size?: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2000 + delay, easing: Easing.inOut(Easing.sin) }),
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
    <Animated.View style={[styles.floating, { left }, style]} pointerEvents="none">
      <Svg width={w} height={h} viewBox="0 0 36 48">
        <Ellipse cx="18" cy="18" rx="14" ry="16" fill={color} opacity={0.85} />
        <Path d="M18 34 L18 44" stroke={color} strokeWidth="1.5" opacity={0.6} />
        <Circle cx="18" cy="44" r="2" fill={color} opacity={0.5} />
      </Svg>
    </Animated.View>
  );
}

function FloatingGift({ right, delay }: { right: number; delay: number }) {
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
    <Animated.View style={[styles.gift, { right }, style]} pointerEvents="none">
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

export function CelebrationBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#9F4CFF', '#C4B5FD', '#FDF4FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <FloatingBalloon left={24} color="#F472B6" delay={0} size={0.9} />
      <FloatingBalloon left={280} color="#60A5FA" delay={300} size={1.1} />
      <FloatingBalloon left={200} color="#A78BFA" delay={600} size={0.75} />
      <FloatingGift right={24} delay={200} />
      <FloatingGift right={80} delay={500} />
    </View>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    top: '12%',
  },
  gift: {
    position: 'absolute',
    top: '22%',
  },
});
