import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export type CalendarToolbarProps = {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday?: () => void;
};

export function CalendarToolbar({ monthLabel, onPrevious, onNext, onToday }: CalendarToolbarProps) {
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
        accessibilityLabel={`${monthLabel}, jump to today`}
        onPress={onToday}
        className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-primary/10 min-h-[44px]">
        <Text className="text-title text-foreground font-bold">{monthLabel}</Text>
        {onToday ? (
          <View className="bg-primary rounded-full px-2 py-0.5">
            <Text className="text-[10px] font-bold text-white">Today</Text>
          </View>
        ) : null}
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
