import { DatabaseManager } from './database-manager';
import { TransactionManager } from './transaction-manager';
import { ImportError } from '@/shared/errors';

export async function exportDatabaseBytes(): Promise<Uint8Array> {
  const db = DatabaseManager.getDb();
  return db.serializeAsync();
}

export type AppBackupSnapshot = {
  exportedAt: string;
  version: number;
  people: Record<string, unknown>[];
  events: Record<string, unknown>[];
  reminders: Record<string, unknown>[];
  wishes: Record<string, unknown>[];
  wishHistory: Record<string, unknown>[];
  cards: Record<string, unknown>[];
  cardTemplates: Record<string, unknown>[];
  surpriseExperiences: Record<string, unknown>[];
  surpriseAnalytics: Record<string, unknown>[];
  surpriseReactions: Record<string, unknown>[];
  surpriseReplies: Record<string, unknown>[];
  notifications: Record<string, unknown>[];
  feedbacks: Record<string, unknown>[];
  settings: Record<string, unknown>[];
  activityLogs: Record<string, unknown>[];
};

export async function exportJsonSnapshot(): Promise<string> {
  const notDeleted = 'is_deleted = 0';

  const [
    people,
    events,
    reminders,
    wishes,
    wishHistory,
    cards,
    cardTemplates,
    surpriseExperiences,
    surpriseAnalytics,
    surpriseReactions,
    surpriseReplies,
    notifications,
    feedbacks,
    settings,
    activityLogs,
  ] = await Promise.all([
    DatabaseManager.getAll(`SELECT * FROM people WHERE ${notDeleted}`),
    DatabaseManager.getAll(`SELECT * FROM events WHERE ${notDeleted}`),
    DatabaseManager.getAll(`SELECT * FROM reminders WHERE ${notDeleted}`),
    DatabaseManager.getAll(`SELECT * FROM ai_wishes WHERE ${notDeleted}`),
    DatabaseManager.getAll(`SELECT * FROM wish_history WHERE COALESCE(is_deleted, 0) = 0`),
    DatabaseManager.getAll(`SELECT * FROM cards WHERE ${notDeleted}`),
    DatabaseManager.getAll(`SELECT * FROM card_templates WHERE COALESCE(is_deleted, 0) = 0`),
    DatabaseManager.getAll(`SELECT * FROM surprise_experiences WHERE ${notDeleted}`),
    DatabaseManager.getAll(`SELECT * FROM surprise_analytics WHERE COALESCE(is_deleted, 0) = 0`),
    DatabaseManager.getAll(`SELECT * FROM surprise_reactions`),
    DatabaseManager.getAll(`SELECT * FROM surprise_replies`),
    DatabaseManager.getAll(`SELECT * FROM notifications WHERE COALESCE(is_deleted, 0) = 0`),
    DatabaseManager.getAll(`SELECT * FROM feedbacks WHERE ${notDeleted}`),
    DatabaseManager.getAll('SELECT key, value, updated_at FROM settings'),
    DatabaseManager.getAll(
      `SELECT uuid, action, entity_type, entity_uuid, metadata, created_at FROM activity_logs
       WHERE COALESCE(is_deleted, 0) = 0 ORDER BY created_at DESC LIMIT 500`,
    ),
  ]);

  const snapshot: AppBackupSnapshot = {
    exportedAt: new Date().toISOString(),
    version: 3,
    people: people as Record<string, unknown>[],
    events: events as Record<string, unknown>[],
    reminders: reminders as Record<string, unknown>[],
    wishes: wishes as Record<string, unknown>[],
    wishHistory: wishHistory as Record<string, unknown>[],
    cards: cards as Record<string, unknown>[],
    cardTemplates: cardTemplates as Record<string, unknown>[],
    surpriseExperiences: surpriseExperiences as Record<string, unknown>[],
    surpriseAnalytics: surpriseAnalytics as Record<string, unknown>[],
    surpriseReactions: surpriseReactions as Record<string, unknown>[],
    surpriseReplies: surpriseReplies as Record<string, unknown>[],
    notifications: notifications as Record<string, unknown>[],
    feedbacks: feedbacks as Record<string, unknown>[],
    settings: settings as Record<string, unknown>[],
    activityLogs: activityLogs as Record<string, unknown>[],
  };

  return JSON.stringify(snapshot, null, 2);
}

function validateSnapshot(data: unknown): AppBackupSnapshot {
  if (!data || typeof data !== 'object') {
    throw new ImportError('Invalid backup file: not a JSON object.');
  }
  const snap = data as Partial<AppBackupSnapshot> & { module?: string };
  if (snap.module && snap.module !== 'all') {
    throw new ImportError(
      'This file is a partial module export. Import a full JSON backup from Backup & Restore or Export Data (All).',
    );
  }
  if (!Array.isArray(snap.people)) {
    throw new ImportError('Invalid backup file: missing people data.');
  }
  return {
    exportedAt: snap.exportedAt ?? new Date().toISOString(),
    version: snap.version ?? 1,
    people: snap.people ?? [],
    events: snap.events ?? [],
    reminders: snap.reminders ?? [],
    wishes: snap.wishes ?? [],
    wishHistory: snap.wishHistory ?? [],
    cards: snap.cards ?? [],
    cardTemplates: snap.cardTemplates ?? [],
    surpriseExperiences: snap.surpriseExperiences ?? [],
    surpriseAnalytics: snap.surpriseAnalytics ?? [],
    surpriseReactions: snap.surpriseReactions ?? [],
    surpriseReplies: snap.surpriseReplies ?? [],
    notifications: snap.notifications ?? [],
    feedbacks: snap.feedbacks ?? [],
    settings: snap.settings ?? [],
    activityLogs: snap.activityLogs ?? [],
  };
}

/** Child tables first so FK deletes succeed when foreign_keys is ON. */
const WIPE_TABLES = [
  'surprise_replies',
  'surprise_reactions',
  'surprise_analytics',
  'surprise_experiences',
  'wish_history',
  'ai_wishes',
  'reminders',
  'cards',
  'card_templates',
  'events',
  'people',
  'notifications',
  'activity_logs',
  'feedbacks',
] as const;

function collectIds(rows: Record<string, unknown>[], key = 'id'): Set<number> {
  const ids = new Set<number>();
  for (const row of rows) {
    const id = row[key];
    if (typeof id === 'number') ids.add(id);
  }
  return ids;
}

function sanitizeForeignKeys(snapshot: AppBackupSnapshot): AppBackupSnapshot {
  const peopleIds = collectIds(snapshot.people);

  const events = snapshot.events.filter((row) => {
    const personId = row.person_id;
    return typeof personId === 'number' && peopleIds.has(personId);
  });
  const eventIds = collectIds(events);

  const reminders = snapshot.reminders.filter((row) => {
    const eventId = row.event_id;
    return typeof eventId === 'number' && eventIds.has(eventId);
  });

  const wishes = snapshot.wishes.filter((row) => {
    const personId = row.person_id;
    return personId == null || (typeof personId === 'number' && peopleIds.has(personId));
  });
  const wishIds = collectIds(wishes);

  const wishHistory = snapshot.wishHistory.filter((row) => {
    const personId = row.person_id;
    const wishId = row.wish_id;
    const personOk = personId == null || (typeof personId === 'number' && peopleIds.has(personId));
    const wishOk = wishId == null || (typeof wishId === 'number' && wishIds.has(wishId));
    return personOk && wishOk;
  });

  const templateIds = collectIds(snapshot.cardTemplates);
  const cards = snapshot.cards.map((row) => {
    const next = { ...row };
    const personId = next.person_id;
    if (typeof personId === 'number' && !peopleIds.has(personId)) {
      next.person_id = null;
    }
    const templateId = next.template_id;
    if (typeof templateId === 'number' && !templateIds.has(templateId)) {
      next.template_id = null;
    }
    return next;
  });

  return { ...snapshot, events, reminders, wishes, wishHistory, cards };
}

function toSqlValue(value: unknown): string | number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'object') return JSON.stringify(value);
  return value as string | number;
}

async function insertRows(table: string, rows: Record<string, unknown>[]): Promise<void> {
  if (rows.length === 0) return;
  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
  for (const row of rows) {
    const values = columns.map((col) => toSqlValue(row[col]));
    await DatabaseManager.run(sql, values);
  }
}

export async function importJsonSnapshot(json: string): Promise<AppBackupSnapshot> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ImportError('Invalid JSON backup file.');
  }

  let snapshot = validateSnapshot(parsed);
  snapshot = sanitizeForeignKeys(snapshot);

  try {
    await TransactionManager.withTransaction(async () => {
      await DatabaseManager.run('PRAGMA foreign_keys = OFF');

      for (const table of WIPE_TABLES) {
        await DatabaseManager.run(`DELETE FROM ${table}`);
      }
      await DatabaseManager.run('DELETE FROM settings');

      await insertRows('people', snapshot.people);
      await insertRows('card_templates', snapshot.cardTemplates);
      await insertRows('events', snapshot.events);
      await insertRows('ai_wishes', snapshot.wishes);
      await insertRows('wish_history', snapshot.wishHistory);
      await insertRows('reminders', snapshot.reminders);
      await insertRows('cards', snapshot.cards);
      await insertRows('surprise_experiences', snapshot.surpriseExperiences);
      await insertRows('surprise_analytics', snapshot.surpriseAnalytics);
      await insertRows('surprise_reactions', snapshot.surpriseReactions);
      await insertRows('surprise_replies', snapshot.surpriseReplies);
      await insertRows('notifications', snapshot.notifications);
      await insertRows('feedbacks', snapshot.feedbacks);
      await insertRows('activity_logs', snapshot.activityLogs);

      for (const setting of snapshot.settings) {
        const key = setting.key as string;
        const value = setting.value as string;
        const updatedAt = (setting.updated_at as string) ?? new Date().toISOString();
        if (key && value !== undefined) {
          await DatabaseManager.run(
            'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
            [key, String(value), updatedAt],
          );
        }
      }

      await DatabaseManager.run('PRAGMA foreign_keys = ON');
      await DatabaseManager.run(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        ['legacy_import_done', 'true', new Date().toISOString()],
      );
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Import failed';
    if (message.includes('FOREIGN KEY') || message.includes('constraint')) {
      throw new ImportError(
        'Import failed due to invalid data references. Please export a fresh full backup and try again.',
      );
    }
    throw new ImportError(message);
  }

  return snapshot;
}

export async function importDatabaseBytes(_bytes: Uint8Array): Promise<void> {
  throw new ImportError('SQLite binary import is not supported. Use JSON restore instead.');
}

export type ExportModule =
  | 'people'
  | 'events'
  | 'reminders'
  | 'wishes'
  | 'cards'
  | 'settings'
  | 'notifications'
  | 'activity'
  | 'all';

export async function exportModuleJson(module: ExportModule): Promise<string> {
  const notDeleted = 'is_deleted = 0';
  const payload: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    module,
    version: 2,
  };

  switch (module) {
    case 'people':
      payload.people = await DatabaseManager.getAll(`SELECT * FROM people WHERE ${notDeleted}`);
      break;
    case 'events':
      payload.events = await DatabaseManager.getAll(`SELECT * FROM events WHERE ${notDeleted}`);
      break;
    case 'reminders':
      payload.reminders = await DatabaseManager.getAll(`SELECT * FROM reminders WHERE ${notDeleted}`);
      break;
    case 'wishes':
      payload.wishes = await DatabaseManager.getAll(`SELECT * FROM ai_wishes WHERE ${notDeleted}`);
      payload.wishHistory = await DatabaseManager.getAll(
        `SELECT * FROM wish_history WHERE COALESCE(is_deleted, 0) = 0`,
      );
      break;
    case 'cards':
      payload.cards = await DatabaseManager.getAll(`SELECT * FROM cards WHERE ${notDeleted}`);
      payload.cardTemplates = await DatabaseManager.getAll(
        `SELECT * FROM card_templates WHERE COALESCE(is_deleted, 0) = 0`,
      );
      break;
    case 'settings':
      payload.settings = await DatabaseManager.getAll('SELECT key, value, updated_at FROM settings');
      break;
    case 'notifications':
      payload.notifications = await DatabaseManager.getAll(
        `SELECT * FROM notifications WHERE COALESCE(is_deleted, 0) = 0`,
      );
      break;
    case 'activity':
      payload.activityLogs = await DatabaseManager.getAll(
        `SELECT * FROM activity_logs WHERE COALESCE(is_deleted, 0) = 0 ORDER BY created_at DESC LIMIT 500`,
      );
      break;
    case 'all':
      return exportJsonSnapshot();
  }

  return JSON.stringify(payload, null, 2);
}

export async function exportModuleCsv(module: ExportModule): Promise<string> {
  const json = await exportModuleJson(module);
  const data = JSON.parse(json) as Record<string, unknown>;
  const rows = (data.people ?? data.events ?? data.wishes ?? data.cards ?? []) as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(rows) || rows.length === 0) {
    return 'No data';
  }
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val === null || val === undefined ? '' : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(','),
    ),
  ];
  return lines.join('\n');
}
