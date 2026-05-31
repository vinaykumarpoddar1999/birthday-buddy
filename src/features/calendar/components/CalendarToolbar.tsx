import { Pressable, Text, View } from 'react-native';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';

export type CalendarToolbarProps = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
};

export function CalendarToolbar({ monthLabel, onPrevious, onNext }: CalendarToolbarProps) {
  return (
    <View className="flex-row items-center justify-between mb-4 px-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Previous month"
        onPress={onPrevious}
        className="h-11 w-11 rounded-full bg-surface border border-border items-center justify-center shadow-sm">
        <ChevronLeft size={20} color="#7C3AED" strokeWidth={2.5} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${monthLabel}, open month picker`}
        className="flex-row items-center gap-1 px-3 min-h-[44px]">
        <Text className="text-title text-foreground font-bold">{monthLabel}</Text>
        <ChevronDown size={18} color="#6B7280" />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Next month"
        onPress={onNext}
        className="h-11 w-11 rounded-full bg-surface border border-border items-center justify-center shadow-sm">
        <ChevronRight size={20} color="#7C3AED" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
