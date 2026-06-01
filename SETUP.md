# BirthdayBuddy Setup (Offline SQLite)

## Requirements

- Node 20+
- Expo SDK 56 (development build recommended; Expo Go for SDK 56 is limited)

## Quick start

```bash
cd birthday-buddy
npm install
npm start
```

No Supabase environment variables are required for v1. Optional analytics keys:

- `EXPO_PUBLIC_POSTHOG_API_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`

## Architecture

SQLite initializes on launch via `DatabaseProvider`. All CRUD flows through `repositories` → `services` → React Query hooks.

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Start Expo dev server |
| `npm run typecheck` | TypeScript check |
| `npm test` | Jest unit tests |
| `npm run lint` | ESLint |

## Future cloud sync

The `supabase/` folder is retained as a reference schema only. Runtime does not connect to Supabase in the offline v1 build.
