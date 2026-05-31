# BirthdayBuddy — Setup Guide

## 1. Environment variables

```bash
cp .env.example .env
```

Edit `.env` with values from [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings** → **API**:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Optional: `EXPO_PUBLIC_POSTHOG_API_KEY`, `EXPO_PUBLIC_POSTHOG_HOST`

**Do not** put `OPENAI_API_KEY` in the mobile app. Set it as a Supabase secret (step 4).

### Local Supabase (Docker required)

```bash
npm run supabase:start
npm run setup:env
```

This writes local API URL and anon key into `.env`.

---

## 2. Database migrations

### Option A — Supabase CLI (linked or local)

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run supabase:db-push
```

### Option B — SQL Editor (no CLI)

In the dashboard **SQL Editor**, run in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_storage_buckets.sql`
3. `supabase/migrations/003_auth_profile_trigger.sql`

---

## 3. Regenerate TypeScript types (optional)

After migrations are applied:

```bash
npm run supabase:types
```

Merge or replace `src/types/database.ts` with generated output, or keep the hand-maintained types (already include `Relationships` for inference).

---

## 4. Edge functions & OpenAI secret

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF

# Windows PowerShell — set your key first:
$env:OPENAI_API_KEY = "sk-..."

npm run supabase:secrets-set
npm run supabase:functions-deploy
```

Functions:

- `generate-wish`
- `suggest-gift`
- `create-card`

---

## 5. Run the app

```bash
npm install
npm start
```

Auth flow: unauthenticated users → `/(auth)/login`. After sign-in → `/(tabs)` (Home, Contacts, Celebrate, Premium, Settings).

---

## Troubleshooting

| Issue | Fix |
|--------|-----|
| `supabase start` fails | Install [Docker Desktop](https://docs.docker.com/desktop/) |
| Invalid API URL | Update `.env` with real project URL (not placeholder) |
| RLS errors | Ensure migrations ran and user is authenticated |
| Functions 500 | Set `OPENAI_API_KEY` in Supabase secrets |
