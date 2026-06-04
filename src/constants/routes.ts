/** Canonical Expo Router paths (trailing slash avoids tab REPLACE errors). */
export const ROUTES = {
  home: '/(tabs)/',
  homeIndex: '/(tabs)/index',
  lock: '/(auth)/lock',
  onboarding: '/(auth)/onboarding',
  welcome: '/(auth)/welcome',
} as const;
