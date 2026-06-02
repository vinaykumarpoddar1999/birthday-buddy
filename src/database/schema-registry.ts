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
  users: { syncReady: true, description: 'Auth user accounts' },
  user_security: { syncReady: true, description: 'Password/PIN hashes and recovery' },
  user_sessions: { syncReady: true, description: 'Active session metadata' },
  security_preferences: { syncReady: true, description: 'Auth and app lock preferences' },
  login_history: { syncReady: true, description: 'Login audit trail' },
  device_registry: { syncReady: true, description: 'Trusted devices' },
  surprise_experiences: { syncReady: true, description: 'Surprise Link Studio experiences' },
  surprise_analytics: { syncReady: true, description: 'Surprise experience analytics' },
  surprise_reactions: { syncReady: true, description: 'Recipient reactions on surprises' },
  surprise_replies: { syncReady: true, description: 'Recipient replies on surprises' },
} as const;

export type SchemaTableName = keyof typeof SCHEMA_REGISTRY;
