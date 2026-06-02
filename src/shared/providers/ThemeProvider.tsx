import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import * as SystemUI from 'expo-system-ui';

import { useSettingsStore } from '@/stores/settings.store';
import { useThemeStore } from '@/stores/theme.store';

function resolveTimeOfDayTheme(): 'light' | 'dark' {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const mode = useThemeStore((s) => s.mode);
  const dynamicTheme = useSettingsStore((s) => s.appearanceSettings.dynamicTheme);
  const systemScheme = useSystemColorScheme();
  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    if (!dynamicTheme) return;
    const id = setInterval(() => setTimeTick((tick) => tick + 1), 60_000);
    return () => clearInterval(id);
  }, [dynamicTheme]);

  const resolved = useMemo(() => {
    if (dynamicTheme) {
      return resolveTimeOfDayTheme();
    }
    return mode === 'system' ? (systemScheme ?? 'light') : mode;
  }, [dynamicTheme, mode, systemScheme, timeTick]);

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
