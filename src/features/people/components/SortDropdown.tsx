import { Pressable, Text, View } from 'react-native';
import { ArrowDownUp, ChevronDown } from 'lucide-react-native';

import type { SortDirection } from '../types';

type SortDropdownProps = {
  valueLabel: string;
  sortDirection: SortDirection;
  onPressDropdown: () => void;
  onToggleDirection: () => void;
};

export function SortDropdown({
  valueLabel,
  sortDirection,
  onPressDropdown,
  onToggleDirection,
}: SortDropdownProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-[12px] leading-[16px] text-foreground-secondary">Sort by</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Sort option ${valueLabel}`}
          onPress={onPressDropdown}
          className="h-8 px-3 rounded-lg border border-border/80 bg-surface flex-row items-center">
          <Text className="text-[12px] leading-[16px] text-primary font-semibold mr-1.5">{valueLabel}</Text>
          <ChevronDown size={14} color="#7C3AED" />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Sort direction ${sortDirection}`}
        onPress={onToggleDirection}
        className="h-8 w-8 rounded-lg border border-border/80 bg-surface items-center justify-center">
        <ArrowDownUp size={14} color="#7C3AED" />
      </Pressable>
    </View>
  );
}
