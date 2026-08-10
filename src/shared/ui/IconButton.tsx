import { Pressable, Text, View, type PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export type IconButtonProps = PressableProps & {
  icon: LucideIcon;
  iconColor?: string;
  size?: 'sm' | 'md';
  badge?: number;
};

const BTN_PX: Record<'sm' | 'md', number> = { sm: 48, md: 48 };
const ICON_PX: Record<'sm' | 'md', number> = { sm: 20, md: 22 };

export function IconButton({
  icon: Icon,
  iconColor = '#111827',
  size = 'md',
  badge,
  className,
  ...props
}: IconButtonProps) {
  const px = BTN_PX[size];
  const iconSize = ICON_PX[size];

  return (
    <Pressable
      accessibilityRole="button"
      style={{ width: px, height: px, borderRadius: px / 2 }}
      className={`relative bg-surface items-center justify-center shadow-sm border border-border ${className ?? ''}`}
      {...props}>
      <Icon size={iconSize} color={iconColor} />
      {badge != null && badge > 0 ? (
        <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-error items-center justify-center px-1">
          <Text className="text-[10px] font-bold text-white">{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
