/** Central registry of SQLite tables and their sync-readiness. */
export const SCHEMA_REGISTRY = {
  schema_migrations: { syncReady: false, description: 'Migration tracking' },
  settings: { syncReady: false, description: 'Key-value app settings' },
  people: { syncReady: true, description: 'Contacts and birthday people' },
  events: { syncReady: true, description: 'Birthday and custom events' },
  reminders: { syncReady: true, description: 'Scheduled reminder records' },
  ai_wishes: { syncReady: true, description: 'Generated wishes' },
  wish_history: { syncReady: true, description: 'Wish action history' },
  card_templates: { syncReady: true, description: 'Card studio templates' },
  cards: { syncReady: true, description: 'User saved cards' },
  notifications: { syncReady: true, description: 'In-app notification center' },
  activity_logs: { syncReady: true, description: 'User activity audit trail' },
  feedbacks: { syncReady: true, description: 'User feedback submissions' },
  search_index: { syncReady: false, description: 'FTS5 virtual search index' },
} as const;

export type SchemaTableName = keyof typeof SCHEMA_REGISTRY;
