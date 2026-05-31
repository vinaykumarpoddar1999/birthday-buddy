import { ActivityIndicator, View } from 'react-native';

export type LoaderProps = {
  size?: 'small' | 'large';
  fullScreen?: boolean;
};

export function Loader({ size = 'large', fullScreen = false }: LoaderProps) {
  const indicator = <ActivityIndicator size={size} color="#9F4CFF" />;

  if (fullScreen) {
    return <View className="flex-1 items-center justify-center bg-background">{indicator}</View>;
  }

  return <View className="items-center justify-center p-4">{indicator}</View>;
}
