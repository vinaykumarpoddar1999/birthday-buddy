import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Inbox } from 'lucide-react-native';

import { EmptyState, type EmptyStateProps } from './EmptyState';
import { ErrorState, type ErrorKind } from './ErrorState';
import { Loader } from './Loader';

export type ScreenStateProps = {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  error?: Error | null;
  errorKind?: ErrorKind;
  onRetry?: () => void;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptySubtitle?: string;
  emptyAction?: EmptyStateProps['primaryAction'];
  emptySecondaryAction?: EmptyStateProps['secondaryAction'];
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ScreenState({
  isLoading,
  isError,
  isEmpty,
  error,
  errorKind = 'unknown',
  onRetry,
  emptyIcon = Inbox,
  emptyTitle = 'Nothing here yet',
  emptySubtitle,
  emptyAction,
  emptySecondaryAction,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
  className = '',
}: ScreenStateProps) {
  if (isLoading) {
    return (
      <View className={className}>{loadingComponent ?? <Loader fullScreen />}</View>
    );
  }

  if (isError) {
    return (
      <View className={className}>
        {errorComponent ?? (
          <ErrorState
            kind={errorKind}
            message={error?.message}
            onRetry={onRetry}
          />
        )}
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className={className}>
        {emptyComponent ?? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            subtitle={emptySubtitle}
            primaryAction={emptyAction}
            secondaryAction={emptySecondaryAction}
          />
        )}
      </View>
    );
  }

  return <>{children}</>;
}
