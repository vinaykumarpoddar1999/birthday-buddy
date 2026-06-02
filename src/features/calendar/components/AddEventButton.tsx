import { Pressable, Text } from 'react-native';
import { Plus } from 'lucide-react-native';

export type AddEventButtonProps = {
  onPress?: () => void;
};

export function AddEventButton({ onPress }: AddEventButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add event"
      onPress={onPress}
      className="flex-row items-center bg-primary rounded-full px-3.5 py-2.5 gap-1.5 min-h-[44px] shadow-md shrink-0">
      <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
      <Text className="text-caption text-white font-semibold">Add</Text>
    </Pressable>
  );
}
