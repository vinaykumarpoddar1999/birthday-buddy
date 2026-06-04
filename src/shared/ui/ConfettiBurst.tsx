import { useEffect, useState } from 'react';
import { Dimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const THEME_COLORS = ['#7C3AED', '#A855F7', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#F472B6'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ConfettiBurstProps = {
  active?: boolean;
  /** Auto-stop burst after ms (default 3000). */
  durationMs?: number;
  count?: number;
  style?: StyleProp<ViewStyle>;
};

export const ConfettiBurst = ({
  active = true,
  durationMs = 3000,
  count = 120,
  style,
}: ConfettiBurstProps) => {
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(hide);
  }, [active, durationMs]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }, style]}>
      <ConfettiCannon
        count={count}
        origin={{ x: SCREEN_WIDTH / 2, y: -20 }}
        fadeOut
        autoStart
        explosionSpeed={350}
        fallSpeed={2800}
        colors={THEME_COLORS}
      />
    </View>
  );
};
