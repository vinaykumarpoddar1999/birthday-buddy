import { Pressable, Text, type PressableProps } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:opacity-90 shadow-md',
  secondary: 'bg-secondary active:opacity-90 shadow-md',
  outline: 'border border-primary bg-transparent',
  ghost: 'bg-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
};

const textVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white font-semibold',
  secondary: 'text-white font-semibold',
  outline: 'text-primary font-semibold',
  ghost: 'text-foreground font-medium',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={`rounded-xl items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      {...props}>
      <Text className={textVariantClasses[variant]}>{loading ? 'Loading...' : label}</Text>
    </Pressable>
  );
}
