import { Pressable, Text, TextInput, View } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onFilterPress: () => void;
  filterActive?: boolean;
};

export function SearchBar({ value, onChangeText, onFilterPress, filterActive }: SearchBarProps) {
  return (
    <View className="flex-row items-center gap-2.5 mb-4">
      <View className="flex-1 flex-row items-center rounded-2xl bg-white border border-gray-100 h-12 px-4 shadow-sm">
        <Search size={17} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search people..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-body text-foreground ml-2.5 p-0"
          accessibilityLabel="Search contacts"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle filters"
        onPress={onFilterPress}
        className={`h-12 w-12 rounded-2xl items-center justify-center ${
          filterActive ? 'bg-primary' : 'bg-white border border-gray-100'
        }`}
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 2 }}>
        <SlidersHorizontal size={18} color={filterActive ? '#FFF' : '#7C3AED'} />
      </Pressable>
    </View>
  );
}
