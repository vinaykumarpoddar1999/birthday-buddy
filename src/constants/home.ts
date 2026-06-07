export const HOME_QUICK_ACTIONS = [
  { title: 'AI Wish', subtitle: '', icon: 'wand' as const, tint: '#F472B6' },
  { title: 'Create Card', subtitle: '', icon: 'video' as const, tint: '#60A5FA' },
] as const;

export const HOME_ACTION_GRID = [
  { id: 'import-contacts', label: 'Import Contacts', icon: 'contacts' as const },
  { id: 'create-card', label: 'Create Card', icon: 'gift' as const },
  { id: 'group', label: 'View People', icon: 'users' as const },
  { id: 'ai-wish', label: 'AI Wishes', icon: 'wand' as const },
] as const;
