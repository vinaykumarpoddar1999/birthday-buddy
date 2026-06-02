import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

type AppErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
};

type AppErrorBoundaryState = {
  error: Error | null;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error('[AppErrorBoundary]', error, info.componentStack);
    }
  }

  private handleRetry = (): void => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <View className="h-16 w-16 rounded-2xl bg-red-100 items-center justify-center mb-5">
          <AlertTriangle size={32} color="#DC2626" />
        </View>
        <Text className="text-title font-bold text-foreground text-center">
          Something went wrong
        </Text>
        <Text className="text-caption text-foreground-secondary text-center mt-2 leading-5 max-w-[300px]">
          The app hit an unexpected error during startup. You can try again without reinstalling.
        </Text>
        {__DEV__ && error.message ? (
          <Text className="text-xs text-foreground-muted text-center mt-3 max-w-[320px]">
            {error.message}
          </Text>
        ) : null}
        <Pressable
          onPress={this.handleRetry}
          className="overflow-hidden rounded-2xl mt-6"
          accessibilityRole="button"
          accessibilityLabel="Try again">
          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row items-center px-5 py-3 gap-2">
            <RefreshCw size={16} color="#FFF" />
            <Text className="text-[14px] font-bold text-white">Try Again</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }
}
