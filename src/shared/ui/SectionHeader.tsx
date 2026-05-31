import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-title text-foreground">{title}</Text>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          className="flex-row items-center gap-0.5">
          <Text className="text-caption text-primary font-semibold">{actionLabel}</Text>
          <ChevronRight size={14} color="#7C3AED" />
        </Pressable>
      ) : null}
    </View>
  );
}
