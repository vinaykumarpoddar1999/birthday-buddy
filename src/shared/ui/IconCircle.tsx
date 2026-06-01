import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

const SIZE_MAP = {
  sm: { container: 40, icon: 18, stroke: 2 },
  md: { container: 56, icon: 24, stroke: 2 },
  lg: { container: 72, icon: 32, stroke: 1.75 },
  xl: { container: 88, icon: 40, stroke: 1.5 },
} as const;

export type IconCircleSize = keyof typeof SIZE_MAP;

export type IconCircleProps = {
  icon: LucideIcon;
  size?: IconCircleSize;
  iconColor?: string;
  bgColor?: string;
  className?: string;
  accessibilityLabel?: string;
};

export function IconCircle({
  icon: Icon,
  size = 'md',
  iconColor = '#7C3AED',
  bgColor = '#EDE9FE',
  className = '',
  accessibilityLabel,
}: IconCircleProps) {
  const dims = SIZE_MAP[size];

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={`items-center justify-center ${className}`.trim()}
      style={{
        width: dims.container,
        height: dims.container,
        borderRadius: dims.container / 2,
        backgroundColor: bgColor,
      }}>
      <Icon size={dims.icon} color={iconColor} strokeWidth={dims.stroke} />
    </View>
  );
}
