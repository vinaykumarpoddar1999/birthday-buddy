import { View, type ViewProps } from 'react-native';

export type CardProps = ViewProps & {
  variant?: 'default' | 'elevated';
};

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
  const variantClass = variant === 'elevated' ? 'shadow-lg shadow-black/20' : '';

  return (
    <View
      className={`rounded-2xl bg-surface p-4 border border-border/80 shadow-card ${variantClass} ${className ?? ''}`}
      {...props}>
      {children}
    </View>
  );
}
