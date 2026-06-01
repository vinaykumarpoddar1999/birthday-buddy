import { Pressable, Text, View } from 'react-native';
import { Plus, Users } from 'lucide-react-native';

type PeopleHeaderProps = {
  contactCountLabel: string;
  onAddPress: () => void;
};

export function PeopleHeader({ contactCountLabel, onAddPress }: PeopleHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4 pt-1">
      <View>
        <View className="flex-row items-center gap-2">
          <Text className="text-heading font-bold text-foreground">People</Text>
          <Users size={18} color="#7C3AED" />
        </View>
        <Text className="text-caption text-foreground-secondary mt-0.5">{contactCountLabel}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add person"
        onPress={onAddPress}
        className="h-11 flex-row items-center bg-primary rounded-full px-4 gap-1.5"
        style={{
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 6,
        }}>
        <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
        <Text className="text-[13px] font-bold text-white">Add</Text>
      </Pressable>
    </View>
  );
}
