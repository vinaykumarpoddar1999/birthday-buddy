import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, type PressableProps } from 'react-native';

const TOUCH_SIZE = 48;

export type ScreenBackButtonProps = Omit<PressableProps, 'children'> & {
  accessibilityLabel?: string;
};

export function ScreenBackButton({
  onPress,
  accessibilityLabel = 'Go back',
  className,
  ...props
}: ScreenBackButtonProps) {
  const handlePress = onPress ?? (() => router.back());

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={4}
      style={{ width: TOUCH_SIZE, height: TOUCH_SIZE, minWidth: TOUCH_SIZE, minHeight: TOUCH_SIZE }}
      className={`mr-3 rounded-full bg-surface border border-border items-center justify-center ${className ?? ''}`}
      {...props}>
      <ArrowLeft size={20} color="#111827" />
    </Pressable>
  );
}
