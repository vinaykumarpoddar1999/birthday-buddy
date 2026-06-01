import { Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import { QuickActionsRow, type QuickActionCardProps } from './QuickActionCard';

export type BirthdayHeroCardProps = {
  name: string;
  age: number;
  dateLabel: string;
  countdown: string;
  friendCount: number;
  extraFriends: number;
  quickActions: QuickActionCardProps[];
};

export function BirthdayHeroCard({
  name,
  age,
  dateLabel,
  countdown,
  friendCount,
  extraFriends,
  quickActions,
}: BirthdayHeroCardProps) {
  return (
    <View className="rounded-lg overflow-hidden shadow-lg">
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#5B21B6', '#4C1D95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View className="px-5 pt-5 pb-0">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-2 min-w-0">
              <Text className="text-caption text-white/75 mb-1">Next Birthday</Text>
              <Text className="text-[22px] leading-[28px] text-white font-bold" numberOfLines={1}>
                {name}
              </Text>
              <Text className="text-body text-white/90 mt-1">
                Turns {age} on {dateLabel}
              </Text>
              <Text className="text-[15px] text-[#FCD34D] font-bold mt-1.5">{countdown}</Text>
              <View className="flex-row items-center mt-3">
                {Array.from({ length: Math.min(friendCount, 4) }).map((_, index) => (
                  <View key={index} style={{ marginLeft: index === 0 ? 0 : -10 }}>
                    <ProfilePlaceholder
                      size="xs"
                      variant="group"
                      borderClassName="border-2 border-[#5B21B6]"
                    />
                  </View>
                ))}
                {extraFriends > 0 ? (
                  <View
                    className="h-8 w-8 rounded-full bg-white/20 border-2 border-[#5B21B6] items-center justify-center"
                    style={{ marginLeft: -10 }}>
                    <Text className="text-[10px] text-white font-bold">+{extraFriends}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View className="items-center w-[108px]">
              <Pressable
                accessibilityRole="button"
                className="h-8 w-8 rounded-full bg-[#4C1D95]/80 items-center justify-center self-end mb-2"
                onPress={() => {}}>
                <ChevronRight size={18} color="#FFFFFF" />
              </Pressable>
              <View className="relative items-center">
                <ProfilePlaceholder
                  size="xl"
                  variant="female"
                  borderClassName="border-4 border-white/40"
                />
                <View className="absolute -bottom-1 -left-1">
                  <ProfilePlaceholder size="sm" variant="cake" />
                </View>
              </View>
            </View>
          </View>
        </View>
        <QuickActionsRow actions={quickActions} />
      </LinearGradient>
    </View>
  );
}
