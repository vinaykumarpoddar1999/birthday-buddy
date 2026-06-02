import { useSettingsStore } from '../settings.store';
import { useThemeStore } from '../theme.store';

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().reset();
    useThemeStore.setState({ mode: 'system' });
  });

  it('syncs theme mode to theme store when setTheme is called', () => {
    useSettingsStore.getState().setTheme('dark');
    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  it('updates appearance theme and global theme together', () => {
    useSettingsStore.getState().updateAppearanceSettings({ theme: 'light' });
    expect(useSettingsStore.getState().appearanceSettings.theme).toBe('light');
    expect(useSettingsStore.getState().theme).toBe('light');
    expect(useThemeStore.getState().mode).toBe('light');
  });

  it('merges notification preference updates', () => {
    useSettingsStore.getState().updateNotificationPrefs({ birthdayAlerts: false });
    expect(useSettingsStore.getState().notificationPrefs.birthdayAlerts).toBe(false);
    expect(useSettingsStore.getState().notificationPrefs.pushNotifications).toBe(true);
  });

  it('hydrates theme into theme store', () => {
    useSettingsStore.getState().hydrate({ theme: 'dark' });
    expect(useThemeStore.getState().mode).toBe('dark');
  });
});
