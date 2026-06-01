export const HOME_QUICK_ACTIONS = [
  { title: 'AI Wish', subtitle: 'Generate', icon: 'wand' as const, tint: '#F472B6' },
  { title: 'Create Card', subtitle: 'Make it special', icon: 'video' as const, tint: '#60A5FA' },
  { title: 'Surprise Card', subtitle: 'Send love', icon: 'link' as const, tint: '#C4B5FD' },
  { title: 'Gift Ideas', subtitle: 'For them', icon: 'gift' as const, tint: '#2DD4BF' },
] as const;

export const HOME_ACTION_GRID = [
  { id: 'import-contacts', label: 'Import Contacts', icon: 'contacts' as const },
  { id: 'create-card', label: 'Create Card', icon: 'gift' as const },
  { id: 'group', label: 'View People', icon: 'users' as const },
  { id: 'ai-wish', label: 'AI Wishes', icon: 'wand' as const },
] as const;
