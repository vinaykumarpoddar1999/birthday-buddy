import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import * as SystemUI from 'expo-system-ui';

import { useThemeStore } from '@/stores/theme.store';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useSystemColorScheme();

  const resolved = mode === 'system' ? (systemScheme ?? 'light') : mode;
  const isDark = resolved === 'dark';

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(isDark ? '#111827' : '#F8F6FC');
  }, [isDark]);

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`} style={{ flex: 1 }}>
      {children}
    </View>
  );
}
