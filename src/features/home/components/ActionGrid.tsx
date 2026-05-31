import { Text, View, Pressable } from 'react-native';
import {
  BookUser,
  Gift,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

const iconMap: Record<string, { Icon: LucideIcon; color: string }> = {
  'user-plus': { Icon: UserPlus, color: '#7C3AED' },
  book: { Icon: BookUser, color: '#14B8A6' },
  users: { Icon: Users, color: '#EC4899' },
  gift: { Icon: Gift, color: '#7C3AED' },
};

export type ActionGridItem = {
  id: string;
  label: string;
  icon: 'user-plus' | 'book' | 'users' | 'gift';
  onPress?: () => void;
};

export function ActionGrid({ items }: { items: ActionGridItem[] }) {
  return (
    <View className="flex-row justify-between mb-4 px-1">
      {items.map((item) => {
        const { Icon, color } = iconMap[item.icon] ?? iconMap.gift;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            className="items-center w-[22%]"
            onPress={item.onPress ?? (() => {})}>
            <View className="h-12 w-12 rounded-xl border-2 border-primary/25 bg-surface items-center justify-center mb-2">
              <Icon size={22} color={color} strokeWidth={2} />
            </View>
            <Text className="text-[11px] text-foreground-secondary text-center font-medium leading-[14px]">
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
