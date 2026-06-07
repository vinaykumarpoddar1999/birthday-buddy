/** Canonical Expo Router paths (trailing slash avoids tab REPLACE errors). */
export const ROUTES = {
  home: '/(tabs)',
  homeIndex: '/(tabs)/index',
  onboarding: '/(auth)/onboarding',
  profileSetup: '/(auth)/profile-setup',
  permissions: '/(auth)/permissions',
  reminderSettings: '/reminder-settings',
} as const;
