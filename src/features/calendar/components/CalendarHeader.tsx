import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CalendarDays, Link2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      <Pressable
        onPress={() => router.push('/surprise-link-studio')}
        accessibilityRole="button"
        accessibilityLabel="Create surprise experience"
        className="mt-3 overflow-hidden rounded-2xl">
        <LinearGradient
          colors={['#F5F3FF', '#EDE9FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center px-4 py-3">
          <View className="h-9 w-9 rounded-xl bg-primary items-center justify-center mr-3">
            <Link2 size={18} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-bold text-foreground">Create Surprise</Text>
            <Text className="text-[11px] text-foreground-secondary">Build an interactive experience</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}
