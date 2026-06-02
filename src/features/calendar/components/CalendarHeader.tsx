import { Text, View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';

export function CalendarHeader() {
  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2">
        <CalendarDays size={26} color="#7C3AED" strokeWidth={2} />
        <Text className="text-[26px] leading-[32px] text-foreground font-bold">Calendar</Text>
      </View>
      <Text className="text-body text-foreground-secondary mt-0.5">
        Never miss a special day
      </Text>
    </View>
  );
}
