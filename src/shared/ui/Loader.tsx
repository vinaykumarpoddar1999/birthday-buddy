import { CelebrationLoader } from './loaders/CelebrationLoader';

export type LoaderProps = {
  size?: 'small' | 'large';
  fullScreen?: boolean;
  progress?: number;
  message?: string;
  variant?: 'default' | 'startup';
};

export function Loader({
  size = 'large',
  fullScreen = false,
  progress,
  message,
  variant = 'default',
}: LoaderProps) {
  return (
    <CelebrationLoader
      size={size}
      fullScreen={fullScreen}
      progress={progress}
      message={message}
      variant={fullScreen ? 'startup' : variant}
    />
  );
}

export { CelebrationLoader } from './loaders/CelebrationLoader';
