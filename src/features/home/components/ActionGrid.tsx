import { Text, View, Pressable } from 'react-native';
import {
  Contact,
  Gift,
  Users,
  Wand2,
  type LucideIcon,
} from 'lucide-react-native';

const iconMap: Record<string, { Icon: LucideIcon; color: string }> = {
  'user-plus': { Icon: Contact, color: '#7C3AED' },
  contacts: { Icon: Contact, color: '#14B8A6' },
  users: { Icon: Users, color: '#EC4899' },
  gift: { Icon: Gift, color: '#7C3AED' },
  wand: { Icon: Wand2, color: '#F472B6' },
};

export type ActionGridItem = {
  id: string;
  label: string;
  icon: 'user-plus' | 'contacts' | 'users' | 'gift' | 'wand';
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
            <View
              className="h-14 w-14 rounded-2xl border border-border/60 bg-surface items-center justify-center mb-2"
              style={{
                shadowColor: color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 2,
              }}>
              <Icon size={22} color={color} strokeWidth={2} />
            </View>
            <Text className="text-[10px] text-foreground-secondary text-center font-semibold leading-[13px]">
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
