# BirthdayBuddy Architecture

Offline-first mobile app. **SQLite is the single source of truth.**

## Data flow

```text
UI (Expo Router) → Hooks → Services → Repositories → SQLite
                 ↘ Zustand (UI state only)
```

Screens must never import `expo-sqlite` or run SQL directly.

## Folder structure

```text
src/
  app/              Expo Router screens
  features/         UI, feature hooks (no Supabase api/)
  shared/           Design system, providers, errors
  database/         DatabaseManager, migrations, provider
  repositories/     SQL + mapping + validation
  services/         Business logic, transactions
  stores/           Zustand UI state
  hooks/            App-level hooks
  types/            Domain entities
  constants/
  config/
  utils/
```

## State

| Concern | Tool |
|--------|------|
| Persistent data | SQLite via repositories |
| Cache / refetch | TanStack Query (optional) |
| Theme, filters, editor | Zustand |
| Device id, keys | expo-secure-store |

## Sync-ready columns

All domain tables include: `uuid`, timestamps, `is_deleted`, `version`, `sync_status`, `device_id`, `last_synced_at`.

## Card templates

Registry templates are mirrored into `card_templates` on startup. UI reads templates via `cardService` / TanStack Query; user cards persist in `cards`.

## Reminders

`reminderService` schedules OS notifications and writes rows to `reminders` when people are created or updated.

## Cloud

The `supabase/` folder is kept as a **future reference** only. Runtime does not call Supabase in v1.

## Database modules

| Module | Role |
|--------|------|
| `DatabaseManager` | Singleton connection, PRAGMAs, init |
| `DatabaseProvider` | React gate until DB + hydration ready |
| `MigrationRunner` / `MigrationRegistry` | Versioned forward migrations (v10) |
| `QueryExecutor` | Parameterized query helpers |
| `TransactionManager` | Transaction wrapper |
| `BackupManager` | JSON + binary export |
| `SchemaRegistry` | Table metadata for audits |

## Scripts

- `npm run typecheck`
- `npm start`
