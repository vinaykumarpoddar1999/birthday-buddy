import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { settingsService } from '@/services/settings/settings.service';
import { useThemeStore } from '@stores/theme.store';
import type { AppSettings } from '@/types/entities';
import { DEFAULT_SETTINGS } from '@/types/entities';

export function useSettings() {
  const queryClient = useQueryClient();
  const setThemeMode = useThemeStore((s) => s.setMode);
  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => settingsService.getAll(),
  });

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      await settingsService.update(patch);
      if (patch.theme) setThemeMode(patch.theme);
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    },
    [setThemeMode, queryClient],
  );

  return { settings, updateSettings };
}
