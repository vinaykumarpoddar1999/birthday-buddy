import { Text, View, Pressable } from 'react-native';
import {
  Gift,
  Link2,
  Sparkles,
  Video,
  type LucideIcon,
} from 'lucide-react-native';

const iconMap: Record<string, LucideIcon> = {
  wand: Sparkles,
  video: Video,
  link: Link2,
  gift: Gift,
};

export type QuickActionCardProps = {
  title: string;
  subtitle: string;
  icon: 'wand' | 'video' | 'link' | 'gift';
  tint: string;
  onPress?: () => void;
};

export function QuickActionCard({ title, subtitle, icon, tint, onPress }: QuickActionCardProps) {
  const Icon = iconMap[icon] ?? Sparkles;

  return (
    <Pressable
      accessibilityRole="button"
      className="flex-1 items-center py-2.5 px-0.5"
      onPress={() => {
        if (onPress) {
          requestAnimationFrame(onPress);
        }
      }}>
      <View
        className="h-10 w-10 rounded-xl items-center justify-center mb-1.5"
        style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
        <Icon size={20} color={tint} strokeWidth={2.2} />
      </View>
      <Text className="text-[11px] text-white font-semibold text-center" numberOfLines={1}>
        {title}
      </Text>
      <Text className="text-[9px] text-white/65 text-center mt-0.5" numberOfLines={1}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

export function QuickActionsRow({
  actions,
}: {
  actions?: QuickActionCardProps[];
}) {
  const safeActions = actions ?? [];

  return (
    <View className="flex-row border-t border-white/15 px-1 pt-2 pb-3">
      {safeActions.map((action) => (
        <QuickActionCard key={action.title} {...action} />
      ))}
    </View>
  );
}
