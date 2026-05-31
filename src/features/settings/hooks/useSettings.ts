import { useCallback, useState } from 'react';

import { useThemeStore } from '@store/theme.store';
import { loadSettings, saveSettings } from '../api/settings.api';
import type { AppSettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const setThemeMode = useThemeStore((s) => s.setMode);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        saveSettings(next);
        if (patch.theme) setThemeMode(patch.theme);
        return next;
      });
    },
    [setThemeMode],
  );

  return { settings, updateSettings };
}
