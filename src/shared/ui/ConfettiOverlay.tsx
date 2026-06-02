import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const COLORS = ['#F472B6', '#FCD34D', '#60A5FA', '#34D399', '#A78BFA', '#FB923C'];

type ParticleProps = {
  left: number;
  delay: number;
  color: string;
  size: number;
};

function Particle({ left, delay, color, size }: ParticleProps) {
  const translateY = useSharedValue(-20);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(120, { duration: 2200, easing: Easing.out(Easing.quad) }),
          withTiming(-20, { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 1800, easing: Easing.linear }), -1, false),
    );
  }, [delay, opacity, rotate, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        style,
        { left: `${left}%`, width: size, height: size, backgroundColor: color, borderRadius: size / 4 },
      ]}
    />
  );
}

export function ConfettiOverlay() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: (i * 17) % 100,
    delay: (i * 120) % 800,
    color: COLORS[i % COLORS.length],
    size: 6 + (i % 3) * 2,
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p) => (
        <Particle key={p.id} left={p.left} delay={p.delay} color={p.color} size={p.size} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
  },
});
