import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Shadows, scale } from '../constants/design-tokens';

export function HomeFloatingButton() {
  const animScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animScale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        onPress={() => router.push('/add-person')}
        onPressIn={() => {
          animScale.value = withSpring(0.9, { damping: 15 });
        }}
        onPressOut={() => {
          animScale.value = withSpring(1, { damping: 12 });
        }}
        accessibilityRole="button"
        accessibilityLabel="Add person">
        <View style={[styles.fabOuter, Shadows.fab]}>
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}>
            <Plus size={scale(30)} color="#FFFFFF" strokeWidth={2.5} />
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: scale(100),
    alignSelf: 'center',
    zIndex: 50,
  },
  fabOuter: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    overflow: 'hidden',
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(32),
  },
});
