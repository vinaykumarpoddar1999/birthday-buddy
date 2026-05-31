import { Pressable } from 'react-native';
import { Gift } from 'lucide-react-native';

export type FloatingActionButtonProps = {
  onPress?: () => void;
};

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Quick gift actions"
      onPress={onPress}
      className="absolute right-5 bottom-6 h-14 w-14 rounded-full bg-primary items-center justify-center shadow-lg border-4 border-background z-10">
      <Gift size={24} color="#FFFFFF" strokeWidth={2.2} />
    </Pressable>
  );
}
