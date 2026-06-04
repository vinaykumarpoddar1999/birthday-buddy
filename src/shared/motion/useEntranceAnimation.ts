import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { DURATION, SPRING } from './tokens';

type EntranceOptions = {
  delay?: number;
  translateY?: number;
};

export function useEntranceAnimation({ delay = 0, translateY = 16 }: EntranceOptions = {}) {
  const opacity = useSharedValue(0);
  const y = useSharedValue(translateY);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: DURATION.entrance }));
    y.value = withDelay(delay, withSpring(0, SPRING.gentle));
  }, [delay, opacity, translateY, y]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return style;
}
