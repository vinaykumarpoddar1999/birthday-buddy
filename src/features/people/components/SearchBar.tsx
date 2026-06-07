import { TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
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
    </View>
  );
}
