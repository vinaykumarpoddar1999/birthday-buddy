import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Contact, Users } from 'lucide-react-native';

type ContactLoadingViewProps = {
  message?: string;
};

function PulseRing({ delay, size }: { delay: number; size: number }) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1400, easing: Easing.out(Easing.cubic) }),
          withTiming(0.85, { duration: 1400, easing: Easing.in(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.15, { duration: 1400 }), withTiming(0.45, { duration: 1400 })),
        -1,
        false,
      ),
    );
  }, [delay, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pulseRing,
        style,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

export function ContactLoadingView({ message = 'Loading your contacts…' }: ContactLoadingViewProps) {
  const bob = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    spin.value = withRepeat(
      withTiming(360, { duration: 2400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [bob, spin]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <View style={styles.stage}>
        <PulseRing delay={0} size={120} />
        <PulseRing delay={300} size={96} />
        <Animated.View style={[styles.orbit, orbitStyle]} pointerEvents="none">
          <View style={styles.orbitDot} />
        </Animated.View>
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <View style={styles.iconCircle}>
            <Contact size={32} color="#7C3AED" strokeWidth={2} />
          </View>
        </Animated.View>
      </View>

      <Text style={styles.title}>Fetching Contacts</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.hintRow}>
        <Users size={14} color="#9CA3AF" />
        <Text style={styles.hint}>This may take a moment on large address books</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  stage: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  orbit: {
    position: 'absolute',
    width: 110,
    height: 110,
    alignItems: 'center',
  },
  orbitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EC4899',
    marginTop: 2,
  },
  iconWrap: {
    zIndex: 2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#F9FAFB',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
