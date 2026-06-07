import { type LucideIcon } from 'lucide-react-native';
import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

export type TabScreenHeaderProps = {
  title: string;
  icon?: LucideIcon;
  rightAction?: ReactNode;
};

export function TabScreenHeader({ title, icon: Icon, rightAction }: TabScreenHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-4 pt-1">
      <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
        {Icon ? (
          <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center">
            <Icon size={20} color="#7C3AED" />
          </View>
        ) : null}
        <Text className="text-[26px] leading-[32px] text-foreground font-bold" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightAction ? <View className="shrink-0 ml-2">{rightAction}</View> : null}
    </View>
  );
}
