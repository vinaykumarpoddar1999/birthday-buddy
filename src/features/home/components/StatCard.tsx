import { Text, View, Pressable } from 'react-native';
import { ArrowRight, Bell, Flame, type LucideIcon } from 'lucide-react-native';

const iconMap = {
  bell: Bell,
  flame: Flame,
} as const;

export type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof iconMap;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  actionBg: string;
  actionColor: string;
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  cardBg,
  iconBg,
  iconColor,
  actionBg,
  actionColor,
}: StatCardProps) {
  const Icon: LucideIcon = iconMap[icon];

  return (
    <View className={`flex-1 ${cardBg} rounded-lg p-4 min-h-[120px]`}>
      <View className="flex-row items-start gap-3">
        <View className={`${iconBg} h-11 w-11 rounded-xl items-center justify-center shrink-0`}>
          <Icon size={22} color={iconColor} strokeWidth={2} />
        </View>
        <View className="flex-1 min-w-0 pt-0.5">
          <Text className="text-[11px] text-foreground-secondary font-medium">{title}</Text>
          <Text className="text-[20px] leading-6 text-foreground font-bold mt-0.5">{value}</Text>
          {subtitle ? (
            <Text className="text-[11px] text-foreground-secondary mt-0.5">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <View className="flex-row justify-end mt-3">
        <Pressable
          accessibilityRole="button"
          className={`h-8 w-8 rounded-full ${actionBg} items-center justify-center`}
          onPress={() => {}}>
          <ArrowRight size={16} color={actionColor} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
