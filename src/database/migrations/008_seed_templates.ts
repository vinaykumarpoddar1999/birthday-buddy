import type { Migration } from '../types';

const SEED_TEMPLATES = [
  {
    uuid: 'tpl-classic-birthday',
    name: 'Classic Birthday',
    category: 'birthday',
    preview_uri: null,
    template_json: JSON.stringify({ id: 'tpl-classic-birthday', layout: 'classic', colors: ['#FF6B9D', '#FFF'] }),
    is_premium: 0,
    tags: JSON.stringify(['birthday', 'classic']),
  },
  {
    uuid: 'tpl-elegant-anniversary',
    name: 'Elegant Anniversary',
    category: 'anniversary',
    preview_uri: null,
    template_json: JSON.stringify({ id: 'tpl-elegant-anniversary', layout: 'elegant', colors: ['#6B5BFF', '#FFF'] }),
    is_premium: 0,
    tags: JSON.stringify(['anniversary', 'elegant']),
  },
  {
    uuid: 'tpl-premium-gold',
    name: 'Premium Gold',
    category: 'birthday',
    preview_uri: null,
    template_json: JSON.stringify({ id: 'tpl-premium-gold', layout: 'premium', colors: ['#D4AF37', '#1A1A1A'] }),
    is_premium: 1,
    tags: JSON.stringify(['birthday', 'premium', 'gold']),
  },
];

export const migration008SeedTemplates: Migration = {
  version: 8,
  name: 'seed_templates',
  up: async (db) => {
    const now = new Date().toISOString();
    for (const t of SEED_TEMPLATES) {
      const existing = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM card_templates WHERE uuid = ?',
        t.uuid,
      );
      if (existing) continue;

      await db.runAsync(
        `INSERT INTO card_templates (uuid, name, category, preview_uri, template_json, is_premium, tags, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        t.uuid,
        t.name,
        t.category,
        t.preview_uri,
        t.template_json,
        t.is_premium,
        t.tags,
        now,
        now,
      );
    }
  },
};
