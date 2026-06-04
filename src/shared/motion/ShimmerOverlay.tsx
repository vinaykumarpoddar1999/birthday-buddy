import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type ShimmerOverlayProps = {
  style?: ViewStyle;
  borderRadius?: number;
};

export function ShimmerOverlay({ style, borderRadius = 12 }: ShimmerOverlayProps) {
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(400, { duration: 1400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { borderRadius }, style]} pointerEvents="none">
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.45)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  gradient: {
    flex: 1,
  },
});
