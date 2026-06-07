import * as SplashScreen from 'expo-splash-screen';
import { type ReactNode, useCallback, useState } from 'react';
import { View } from 'react-native';

import { useDatabaseReady } from '@/database/database-provider';
import { AnimatedSplashScreen } from '@/features/auth/screens/AnimatedSplashScreen';
import { useAuthStore } from '@/stores/auth.store';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type StartupGateProps = {
  children: ReactNode;
};

export function StartupGate({ children }: StartupGateProps) {
  const { isReady: isDatabaseReady } = useDatabaseReady();
  const isAuthHydrated = useAuthStore((s) => s.isHydrated);
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const [animatedSplashDone, setAnimatedSplashDone] = useState(false);

  const isAppReady = isDatabaseReady && isAuthHydrated;

  const handleAnimatedSplashFinish = useCallback(() => {
    setAnimatedSplashDone(true);
  }, []);

  const showAnimatedSplash = isAppReady && !animatedSplashDone;

  return (
    <View style={{ flex: 1 }}>
      {nativeSplashHidden ? children : null}
      {showAnimatedSplash ? (
        <AnimatedSplashScreen
          onReady={() => {
            if (!nativeSplashHidden) {
              void SplashScreen.hideAsync()
                .catch(() => undefined)
                .finally(() => setNativeSplashHidden(true));
            }
          }}
          onFinish={handleAnimatedSplashFinish}
        />
      ) : null}
    </View>
  );
}
