import { Pressable, Text, View } from 'react-native';
import { ArrowLeft, UserPlus2 } from 'lucide-react-native';

type PeopleHeaderProps = {
  contactCountLabel: string;
  onBackPress: () => void;
  onAddPress: () => void;
};

export function PeopleHeader({ contactCountLabel, onBackPress, onAddPress }: PeopleHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBackPress}
        className="h-11 w-11 rounded-full bg-surface border border-border items-center justify-center">
        <ArrowLeft size={20} color="#111827" />
      </Pressable>

      <View className="items-center -mt-0.5">
        <Text className="text-[22px] leading-[28px] text-foreground font-bold">All People</Text>
        <Text className="text-[12px] leading-[16px] text-primary mt-0.5">{contactCountLabel}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add person"
        onPress={onAddPress}
        className="h-11 w-11 rounded-full bg-primary/15 border border-primary/20 items-center justify-center">
        <UserPlus2 size={19} color="#7C3AED" />
      </Pressable>
    </View>
  );
}
