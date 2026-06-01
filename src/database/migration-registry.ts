import { migration001Initial } from './migrations/001_initial';
import { migration002People } from './migrations/002_people';
import { migration003Events } from './migrations/003_events';
import { migration004Reminders } from './migrations/004_reminders';
import { migration005AiWishes } from './migrations/005_ai_wishes';
import { migration006Cards } from './migrations/006_cards';
import { migration007SearchFts } from './migrations/007_search_fts';
import { migration008SeedTemplates } from './migrations/008_seed_templates';
import { migration009SyncColumnsFeedback } from './migrations/009_sync_columns_feedback';
import { migration010SearchFtsExtended } from './migrations/010_search_fts_extended';
import { migration011ProfileSettingsTables } from './migrations/011_profile_settings_tables';
import type { Migration } from './types';

export const MIGRATION_REGISTRY: Migration[] = [
  migration001Initial,
  migration002People,
  migration003Events,
  migration004Reminders,
  migration005AiWishes,
  migration006Cards,
  migration007SearchFts,
  migration008SeedTemplates,
  migration009SyncColumnsFeedback,
  migration010SearchFtsExtended,
  migration011ProfileSettingsTables,
];

export const CURRENT_SCHEMA_VERSION =
  MIGRATION_REGISTRY[MIGRATION_REGISTRY.length - 1]?.version ?? 0;
