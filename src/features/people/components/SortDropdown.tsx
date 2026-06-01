import { Pressable, Text, View } from 'react-native';
import { ArrowDownUp } from 'lucide-react-native';

import type { SortDirection } from '../types';

type SortDropdownProps = {
  sortDirection: SortDirection;
  onToggleDirection: () => void;
  resultCount: number;
};

export function SortDropdown({
  sortDirection,
  onToggleDirection,
  resultCount,
}: SortDropdownProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-caption text-foreground-secondary">
        {resultCount} {resultCount === 1 ? 'person' : 'people'} found
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Sort ${sortDirection === 'asc' ? 'A to Z' : 'Z to A'}`}
        onPress={onToggleDirection}
        className="flex-row items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5">
        <ArrowDownUp size={13} color="#7C3AED" />
        <Text className="text-[11px] text-primary font-semibold">
          {sortDirection === 'asc' ? 'A → Z' : 'Z → A'}
        </Text>
      </Pressable>
    </View>
  );
}
