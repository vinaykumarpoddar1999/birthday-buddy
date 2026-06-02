import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Visible tab bar row height (excluding center button overhang). */
const TAB_BAR_ROW_HEIGHT = 52;

export function HomeFab() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 6) + TAB_BAR_ROW_HEIGHT + 10;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className="absolute right-5 z-50"
      style={[{ bottom }, animatedStyle]}
      pointerEvents="box-none">
      <Pressable
        onPress={() => router.push('/add-person')}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12 });
        }}
        accessibilityRole="button"
        accessibilityLabel="Add person"
        style={{
          height: 56,
          width: 56,
          borderRadius: 28,
          backgroundColor: '#7C3AED',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0,
          shadowColor: '#5B21B6',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 14,
          elevation: 10,
        }}>
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
    </Animated.View>
  );
}
