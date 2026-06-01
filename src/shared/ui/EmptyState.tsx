import { Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { IconCircle } from './IconCircle';

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconColor?: string;
  iconBg?: string;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  subtitle,
  iconColor = '#7C3AED',
  iconBg = '#EDE9FE',
  className = '',
}: EmptyStateProps) {
  return (
    <View className={`items-center py-8 px-4 ${className}`.trim()}>
      <IconCircle icon={icon} size="lg" iconColor={iconColor} bgColor={iconBg} className="mb-4" />
      <Text className="text-title font-bold text-foreground text-center">{title}</Text>
      {subtitle ? (
        <Text className="text-caption text-foreground-secondary text-center mt-1.5 leading-[18px]">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
