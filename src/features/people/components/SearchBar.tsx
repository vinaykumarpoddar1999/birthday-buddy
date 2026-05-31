import { Pressable, Text, TextInput, View } from 'react-native';
import { ListFilter, Search } from 'lucide-react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onFilterPress: () => void;
};

export function SearchBar({ value, onChangeText, onFilterPress }: SearchBarProps) {
  return (
    <View className="flex-row items-center gap-2.5 mb-3">
      <View className="flex-1 flex-row items-center rounded-xl bg-surface border border-border/80 h-12 px-3">
        <Search size={18} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search by name, phone or email..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-body text-foreground ml-2"
          accessibilityLabel="Search contacts"
          allowFontScaling
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open filters"
        onPress={onFilterPress}
        className="h-12 px-3 rounded-xl border border-border/80 bg-surface flex-row items-center justify-center">
        <ListFilter size={18} color="#7C3AED" />
        <Text className="text-caption text-primary font-semibold ml-1.5">Filter</Text>
      </Pressable>
    </View>
  );
}
