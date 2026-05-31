# BirthdayBuddy Architecture

Feature-driven + Clean Architecture with domain modules under `src/features/`.

## Folder structure

```text
src/
├── app/                 # Expo Router screens only
├── shared/              # UI design system, errors, providers
├── features/            # Domain modules (auth, contacts, birthdays, …)
├── services/            # Cross-cutting infra (AI, analytics, notifications, storage)
├── store/               # Zustand UI state only
├── hooks/               # App-level hooks
├── types/               # Shared TypeScript types
├── constants/
├── lib/                 # Supabase, React Query, MMKV, secure storage
└── config/              # Validated env (Zod)
```

## State rules

| Concern | Tool |
|--------|------|
| Server data (contacts, birthdays, wishes) | TanStack Query + `queryKeys` |
| UI state (theme, modals, auth snapshot) | Zustand |
| Auth tokens | `expo-secure-store` |
| Settings / cache | `react-native-mmkv` |

## Path aliases

- `@/*` → `src/*`
- `@shared/*`, `@features/*`, `@services/*`, `@store/*`, `@config/*`

## Environment

Copy `.env.example` to `.env` and set Supabase keys. Never use `process.env` in components — import from `@config/env`.

## Supabase

- Migrations: `supabase/migrations/`
- Edge Functions (AI): `supabase/functions/` — mobile calls functions, not OpenAI directly
- RLS enabled on all tables

## Design system

Use components from `@shared/ui` only (`Button`, `Input`, `Avatar`, `Card`, `Modal`, `Sheet`, `Badge`, `Loader`).

## Navigation

- `/(auth)/login`, `/(auth)/register` — unauthenticated
- `/(tabs)/*` — main app (auth gate in `useAuthRedirect`)
- Tabs: Home, Contacts, Celebrate, Premium, Settings

## Scripts

See `SETUP.md` and `package.json` scripts (`supabase:db-push`, `supabase:functions-deploy`, `setup:env`, `typecheck`).

## Next steps

1. Fill `.env` with real Supabase keys (see `SETUP.md`)
2. Run migrations (`001` → `004`)
3. Deploy edge functions + `OPENAI_API_KEY` secret
4. Wire Google Play / Apple IAP in `features/premium/api/premium.api.ts`
