import { Text, View } from 'react-native';

export type BadgeProps = {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'premium';
};

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-surface text-foreground',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  error: 'bg-error/20 text-error',
  premium: 'bg-primary/20 text-primary',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${variantClasses[variant]}`}>
      <Text className="text-xs font-semibold">{label}</Text>
    </View>
  );
}
