# BirthdayBuddy Design System

## Tokens

Defined in `tailwind.config.js` and `src/constants/design.ts`.

| Token | Value |
|-------|-------|
| Primary | `#7C3AED` |
| Primary Dark | `#5B21B6` |
| Secondary | `#EC4899` |
| Accent Gold | `#F59E0B` |
| Background | `#F8F6FC` |
| Surface | `#FFFFFF` |
| Text Primary | `#111827` |
| Text Secondary | `#6B7280` |

## Typography

- `text-display` — hero titles
- `text-heading` — section titles
- `text-title` — card titles
- `text-body` — body copy
- `text-caption` — labels & meta

## Components

| Component | Location |
|-----------|----------|
| AppHeader | `features/home/components/AppHeader.tsx` |
| BirthdayHeroCard | `features/home/components/BirthdayHeroCard.tsx` |
| QuickActionCard | `features/home/components/QuickActionCard.tsx` |
| UpcomingBirthdayCard | `features/home/components/UpcomingBirthdayCard.tsx` |
| StatCard | `features/home/components/StatCard.tsx` |
| PromoBanner | `features/home/components/PromoBanner.tsx` |
| ActionGrid | `features/home/components/ActionGrid.tsx` |
| HomeTabBar | `shared/navigation/HomeTabBar.tsx` |

## Home screen

`src/features/home/screens/HomeDashboardScreen.tsx` — static mock data only, no API.

## Dark mode

Tailwind `darkMode: 'class'` is enabled. Add `dark:` variants to screens when implementing theme toggle.

## Expo Go note

Storage uses in-memory stub (`src/lib/mmkv.ts`) — no `react-native-mmkv` native module required.
