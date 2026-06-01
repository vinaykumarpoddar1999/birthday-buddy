import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';

import { IconCircle } from './IconCircle';

export type EmptyStateAction = {
  label: string;
  onPress: () => void;
};

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
};

function ActionButton({
  label,
  onPress,
  variant,
}: {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}) {
  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={{ width: '100%', borderRadius: 14, overflow: 'hidden' }}>
        <LinearGradient
          colors={['#7C3AED', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
          }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>{label}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        width: '100%',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
      }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
  iconColor = '#7C3AED',
  iconBg = '#EDE9FE',
  className = '',
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  const hasActions = Boolean(primaryAction || secondaryAction);

  return (
    <View className={`items-center py-8 px-5 ${className}`.trim()}>
      <View
        className="mb-4 rounded-full p-1"
        style={{
          shadowColor: iconColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        }}>
        <IconCircle icon={icon} size="lg" iconColor={iconColor} bgColor={iconBg} />
      </View>
      <Text className="text-title font-bold text-foreground text-center">{title}</Text>
      {subtitle ? (
        <Text className="text-caption text-foreground-secondary text-center mt-2 leading-[20px] max-w-[280px]">
          {subtitle}
        </Text>
      ) : null}

      {hasActions ? (
        <View className="mt-5 w-full max-w-[280px] gap-3">
          {primaryAction ? (
            <ActionButton label={primaryAction.label} onPress={primaryAction.onPress} variant="primary" />
          ) : null}
          {secondaryAction ? (
            <ActionButton
              label={secondaryAction.label}
              onPress={secondaryAction.onPress}
              variant="secondary"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
