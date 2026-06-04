import { type ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SCALE, SPRING } from './tokens';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type AnimatedPressableProps = PressableProps & {
  children: ReactNode;
  scaleTo?: number;
};

export function AnimatedPressable({
  children,
  scaleTo = SCALE.press,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressableBase
      {...props}
      style={[animatedStyle, props.style]}
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, SPRING.micro);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, SPRING.micro);
        onPressOut?.(e);
      }}>
      {children}
    </AnimatedPressableBase>
  );
}
