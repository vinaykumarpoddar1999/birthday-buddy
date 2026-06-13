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

No external environment variables are required. The app runs fully offline with on-device SQLite storage.

## Architecture

SQLite initializes on launch via `DatabaseProvider`. All CRUD flows through `repositories` → `services` → React Query hooks.

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Start Expo dev server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Future cloud sync

The `supabase/` folder is retained as a reference schema only. Runtime does not connect to Supabase in the offline v1 build.
