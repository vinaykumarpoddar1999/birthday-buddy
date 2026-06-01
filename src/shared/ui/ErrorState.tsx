import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

import { IconCircle } from './IconCircle';

export type ErrorKind =
  | 'database'
  | 'network'
  | 'validation'
  | 'storage'
  | 'permission'
  | 'unknown';

export type ErrorStateProps = {
  kind?: ErrorKind;
  icon?: LucideIcon;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onSupport?: () => void;
  supportLabel?: string;
  className?: string;
};

const DEFAULTS: Record<
  ErrorKind,
  { title: string; message: string; iconColor: string; iconBg: string }
> = {
  database: {
    title: 'Database Error',
    message: 'We could not read your saved data. Please try again.',
    iconColor: '#DC2626',
    iconBg: '#FEE2E2',
  },
  network: {
    title: 'Connection Issue',
    message: 'Check your connection and try again.',
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  validation: {
    title: 'Invalid Input',
    message: 'Please review your entries and try again.',
    iconColor: '#7C3AED',
    iconBg: '#EDE9FE',
  },
  storage: {
    title: 'Storage Error',
    message: 'We could not save your changes. Free up space and retry.',
    iconColor: '#DC2626',
    iconBg: '#FEE2E2',
  },
  permission: {
    title: 'Permission Required',
    message: 'Allow the requested permission in Settings to continue.',
    iconColor: '#2563EB',
    iconBg: '#DBEAFE',
  },
  unknown: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
    iconColor: '#DC2626',
    iconBg: '#FEE2E2',
  },
};

export function ErrorState({
  kind = 'unknown',
  icon = AlertTriangle,
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
  onSupport,
  supportLabel = 'Get Help',
  className = '',
}: ErrorStateProps) {
  const defaults = DEFAULTS[kind];

  return (
    <View className={`items-center py-10 px-6 ${className}`.trim()}>
      <IconCircle
        icon={icon}
        size="lg"
        iconColor={defaults.iconColor}
        bgColor={defaults.iconBg}
        className="mb-5"
      />
      <Text className="text-title font-bold text-foreground text-center">{title ?? defaults.title}</Text>
      <Text className="text-caption text-foreground-secondary text-center mt-2 leading-[20px] max-w-[280px]">
        {message ?? defaults.message}
      </Text>

      <View className="flex-row gap-3 mt-6">
        {onRetry ? (
          <Pressable
            onPress={onRetry}
            className="overflow-hidden rounded-2xl"
            accessibilityRole="button">
            <LinearGradient
              colors={['#7C3AED', '#5B21B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-row items-center px-5 py-3 gap-2">
              <RefreshCw size={16} color="#FFF" />
              <Text className="text-[14px] font-bold text-white">{retryLabel}</Text>
            </LinearGradient>
          </Pressable>
        ) : null}
        {onSupport ? (
          <Pressable
            onPress={onSupport}
            className="px-5 py-3 rounded-2xl border border-border bg-surface"
            accessibilityRole="button">
            <Text className="text-[14px] font-semibold text-foreground">{supportLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
